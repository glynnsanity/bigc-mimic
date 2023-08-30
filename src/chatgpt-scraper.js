import { Configuration, OpenAIApi } from 'openai';
import { createCategoryAndProductInBigCommerce } from './bigc-api/bc-api.js';
import puppeteer from 'puppeteer';
import fetch from 'node-fetch';

function getMessage(html){
    return [
        {"role": "user", "content": "You are a helpful assistant who does a fantastic job analyzing HTML code."},
        {"role": "user", "content": `
            I'm trying to use the OpenAI API in order to get help analyzing the HTML of an ecommerce product category page where I want to get relevant product data to send to another system.
            Unfortunately the HTML I want to send to GPT far exceeds OpenAI's API token limit. 
            In order to attempt to work around this limitation, I'm going to separate the HTML text into an amount of characters that will be under the token limit. 
            I'm going to give you one of these chunks of HTML that is incomplete with the goal of getting a few different details of the different products on the page.
            
            These are the details I would like to have for each product that you find on the category page: the product name, the product price, and the source URL for the main image of the product which you should find in a "src" or "srcset" attribute on an img element. 
            There may be multiple image source URLs within the image tag. Please give me the one that appears to be the largest one.
            For the product image, it might be that there is a default placeholder image included, so please try to give me the src url that is most likely the correct image. If it has the product name within the URL then that is most likely the one I'm looking for.
            
            Please follow the guidelines I provide below in order to get the correct product data.
            
            The product data will most often exist within a grid type layout so there will likely be a series of similar product "cards" within the category page structure.
                1) The product data will not look be in a navigation type structure so please do not mistake the navigation for product data.
                2) If the product data is within a section that is similar to breadcrumbs, this will not be the product data that I want.
                3) If the product price is not a number that is more than zero, then this product is not a valid product and you can completely skip this information in your response.
                4) If the product data is within a section that is similar to breadcrumbs, this will not be the product data that I want.
                5) If you cannot find the product name, price and image information, this is not what I'm looking for so please do not give this information to me.
                6) Determine what percentage of certainty you have that this data is what I'm looking for. If you are less than 80% certain that you have found that product data that I'm looking for, please do not include this in your response.
                7) The product data will not be included in the filters section of the category page layout.
            
            
            After you analyze the HTML I give you, please ONLY respond with an array of JSON objects of each product with those three details included: the name as a "name" property, and the price as a "price" property, and the image as an "image" property. I'm going to run JSON parse on your response if you found data, so please do not give me any other text.

            An example of the format I would like would be similar to this:
            [
                {
                    "name": "First Product",
                    "price": "100",
                    "image": "http://imagesourcedomain.com/image1234"
                },
                {
                    "name": "Second Product",
                    "price": "50",
                    "image": "http://imagesourcedomain.com/image56789"    
                }
            ]

            Do not include any other text besides JSON with the product data I need.

            I also need you to not include any data that does not match the guidelines I've given you above, since I'm going to use this JSON data within an API call.
            If you do not find any product data relevant to me, only respond with the text "Nothing Found".
            
            Here is one of the HTML chunks for analysis:
            ${html}`},
    ];
}

const MAX_RETRIES = 15;
const BACKOFF_INTERVAL_MS = 2000;

async function* makeRangeIterator(htmlArray, config) {
    const configuration = new Configuration({
        apiKey: config.gptApiKey,
    });
    const openai = new OpenAIApi(configuration);

    let count = config.count;
    let arrayOfResults = [];

    for (let i = 0; i <= 100; i += 1) {
        const html = htmlArray[i];
        let completion = null;
        let retryCount = 0;
        while (retryCount < MAX_RETRIES) {
            try {
                completion = await openai.createChatCompletion({
                    model: "gpt-4",
                    messages: getMessage(html),
                });
                break;
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    retryCount += 1;
                    const backoff_retry = (retryCount * 2) * BACKOFF_INTERVAL_MS;
                    console.log(`Got a 429 response. Retrying in ${backoff_retry / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, backoff_retry ));
                } else {
                    throw error;
                }
            }
        }

        if (completion) {
            const content = completion.data.choices[0].message.content;
            
            const contentJSONCheck = /\[[\s\S]*\]/.exec(content);
            if ( contentJSONCheck !== null ) {
                const contentWithJSONArray = JSON.parse(/\[[\s\S]*\]/.exec(content)[0]);
                const filteredArray = contentWithJSONArray.filter(function(productObject){
                    productObject.price = productObject.price.replace('$','');
                    
                    return (
                        !productObject.price.includes('$') &&
                        typeof +productObject.price === 'number' &&
                        productObject.price !== '' &&
                        parseFloat(productObject.price).toFixed(2) !== 0 &&
                        content.indexOf('Nothing Found') < 0
                    ) 
                });

                console.log('filtered array ', filteredArray);
                if (filteredArray.length > 0) {
                    count = count - filteredArray.length;
                    if (count <= 0) {
                        i += 100
                        console.log('Found the number of products requested.');
                    }

                    const filteredContent = JSON.stringify(filteredArray);
                    arrayOfResults.push(filteredContent);
                }
            }
            yield completion;
        }
    }
    return arrayOfResults;
}


async function* bcApiIterator(dataArray, config) {
    let count = 0;

    for (let i = 0; i <= config.count - 1; i += 1) {
        const gptResponse = dataArray[i];
        await createCategoryAndProductInBigCommerce({
            storeHash: config.storeHash,
            bcAuthToken: config.bcAuthToken,
            categoryName: config.categoryName,
            productName: gptResponse.name,
            productPrice: gptResponse.price,
            productImage: gptResponse.image
        });
        count++;
        yield `${count} API call(s) have been made`;
    };
    return 'BC API calls have been completed';
}

/*
    The below is our Puppeteer instance (with an autoScroll function that we'll use with Puppeteer).
    This helps us to constrain the portion of HTML that we want on category pages,
    especially for instances when the desired HTML is loaded through a front end script
    like SearchSpring or something similar.

    Once we find the desired HTML. This is where we will split our HTML in an array 
    of chunks that will be in line with current ChatGPT token limits.

    We then call our iterator function created above to execute the ChatGPT calls for each item in the array.
*/

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

export function chatGPTScrapeAndAnalyze(config){
    (async () => {
        console.log('Puppeteer browser is retrieving relevant HTML...')
        const browser = await puppeteer.launch({headless: 'new'});
        const page = await browser.newPage();
    
        await page.goto(config.url, { waitUntil: 'networkidle0', timeout: 0 });
        await autoScroll(page);

        const contentResult = await page.$eval('body', function(body){ return body.outerHTML; });
        const contentNoWhiteSpace = contentResult.replace(/\s/g,'');
        const contentWithNoBackTicks = contentResult.replace(/```[^`]*```/gs, '');
        const contentWithoutScripts = contentWithNoBackTicks.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        const contentWithoutHeaders = contentWithoutScripts.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '');
        const contentWithoutFooters = contentWithoutHeaders.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '');
        const contentWithoutNav = contentWithoutFooters.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '');
        const contentWithoutiFrames = contentWithoutNav.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
        const contentWithoutStyleTags = contentWithoutiFrames.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

        const htmlArray = contentWithoutStyleTags.match(/[\s\S]{1,6000}/g) || [];

        console.log('Sending HTML to ChatGPT for analysis...')
        const it = makeRangeIterator(htmlArray, config);
        let result = await it.next();

        while (!result.done) {
            result = await it.next();
        }

        const arrayOfReturnedResults = `[${result.value.join()}]`;
        const flattenedArray = JSON.parse(arrayOfReturnedResults).flat(1)
        
        console.log('Sending product data to BigCommerce...')
        const bcIt = bcApiIterator(flattenedArray, config);
        let bcResult = await bcIt.next();
        console.log(`\u001B[32m ${bcResult.value}`);

        while (!bcResult.done) {
            bcResult = await bcIt.next();
            console.log(`\u001B[32m ${bcResult.value}`);
        }
    
        await browser.close();
    })();
}
