#!/usr/bin/env node
import fs from "fs";
import inquirer from "inquirer";
import { createRequire } from "module";
import { chatGPTScrapeAndAnalyze } from "../src/chatgpt-scraper.js";
// const require = createRequire(import.meta.url);

function startPrompt(){
    fs.readFile(".config.bigcmimic.json", { encoding: 'utf-8' }, function(err, data) {
        const dataParsed = JSON.parse(data)
        const { storeHash, url, count, categoryName } = Object.assign({}, ...dataParsed);
        inquirer.prompt([{ 
                "type": "input", 
                "name": "url", 
                "message": `Input the Category Page URL that you want to take product data from:`,
                "default": url ? url : ''
            },{ 
                "type": "input", 
                "name": "categoryName", 
                "message": `Enter the name of the category for these products`,
                "default": categoryName ? categoryName : ''
            },{ 
                "type": "input", 
                "name": "count", 
                "message": `How many products do you want to import into BigCommerce?`,
                "default": count ? count : ''
            }
        ]).then((answers) => {
            updateConfigFile(answers, storeHash);
        });
    });
}

async function save(configJSON){
    await fs.promises.writeFile(".config.bigcmimic.json", JSON.stringify(configJSON));
}

async function updateConfigFile(answers, oldStoreHash){
    function check(property) {
        if (property === "storeHash") { return true }
        return Object.hasOwn(answers, property) && answers[property].length > 0;
    }

    if (answers !== undefined && check("url") && check("storeHash") && check("count")) {
        fs.readFile(".config.bigcmimic.json", { encoding: 'utf-8' }, function(err, data) {
            const existingConfig = JSON.parse(data);
            const existingDataObjectFromArray = Object.assign({}, ...existingConfig);

            const newDataObject = {
                "url": `${ answers.url }`,
                "storeHash": `${ answers.storeHash || oldStoreHash }`,
                "count": `${ answers.count }`,
                "categoryName": `${ answers.categoryName }`
            };

            // removing duplicates from existing object array
            Object.keys(newDataObject).forEach((item) => {
                if (existingDataObjectFromArray.hasOwnProperty(item)) {
                    delete existingDataObjectFromArray[item];
                }
            });

            // update with new values
            const mergedDataObject = {... existingDataObjectFromArray, ...newDataObject }
            const configJSON = Object.keys(mergedDataObject).map((item) => {
                return { [item]: mergedDataObject[item] }
            });
            save(configJSON);

            chatGPTScrapeAndAnalyze(Object.assign({}, ...configJSON));
        })
    } else {
        console.log('One of the inputs you entered is invalid');
        startPrompt();
    }
}

if (!fs.existsSync('.config.bigcmimic.json')) {
    console.log('You need to run bigc-mimic init to configure your setup');
} else {
    startPrompt();
}