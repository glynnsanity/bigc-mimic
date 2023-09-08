import fetch from 'node-fetch';

/**
 * Sends POST to create a category with no parent.
 * In POST response, two actions may take place:
 * 1) If 409 status (duplicate category), call getIDFromCategories
 * 2) If else, createProductInBigCommerce is called with newly created category ID passed through
 * 
 *
 * @param object data
 *   An object containing:
 *   - name: The name of the product being parsed through
 *   - img: The image of the product.
 *   - category: The category name.
 *   - price: The product price.
 *
 */
export async function createCategoryAndProductInBigCommerce(data){
    try {
        const createCategoryEndpoint = `https://api.bigcommerce.com/stores/${data.storeHash}/v3/catalog/categories`;
        let options = {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'X-Auth-Token': data.bcAuthToken },
            body: `{ "parent_id": "0", "name": "${data.categoryName}" }`
        };
        const result = await fetch(createCategoryEndpoint, options);
        const json = await result.json();

        if (json.status === 409) {
            await getCatIDFromCategories(data);
        } else {
            let categoryID = json.data.id;
            await createProductInBigCommerce(data, categoryID);
        }  
    } catch(e) {
        console.log('Errror in "createCategoryAndProductInBigCommerce": ', e)
    }
}


/**
 * Sends POST to create a product within a given category.
 * In POST response, a call is made to assign the product to a channel
 * 
 *
 * @param object data
 *   An object containing:
 *   - name: The name of the product being parsed through
 *   - img: The image of the product.
 *   - category: The category name.
 *   - price: The product price.
 * 
 * @param number id
 *   A number value for the category ID.
 * 
 *
 */
export async function createProductInBigCommerce(data, id){
    try {
        const createProductEndpoint = `https://api.bigcommerce.com/stores/${data.storeHash}/v3/catalog/products`;
        let options = {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'X-Auth-Token': data.bcAuthToken },
            body: JSON.stringify({ 
                type: 'physical', 
                name: data.productName, 
                price: data.productPrice, 
                weight: 10, 
                images: [{ 
                    image_url: data.productImage, 
                    is_thumbnail: true
                }], 
                categories: [id] 
            })
        };
        
        const result = await fetch(createProductEndpoint, options)
        const json = await result.json();
        
        if (json.status !== 409) {
            await createProductChannelAssignment(data, json.data.id);
        } else {
            console.log(`${data.productName} has already been created. Skipping as a duplicate product creation attempt.`);
        }
    } catch(e){
        console.log('Error in "createProductInBigCommerce": ', e);
    }
}


/**
 * Sends PUT to update the channel assignment for a product.
 * 
 * 
 * @param number id
 *   A number value for the product ID.
 * 
 */
export async function createProductChannelAssignment(data, id){
    try {
        const createProductChannelAssignmentEndpoint = `https://api.bigcommerce.com/stores/${data.storeHash}/v3/catalog/products/channel-assignments`;
        let options = {
            method: 'put',
            headers: { 'Content-Type': 'application/json', 'X-Auth-Token': data.bcAuthToken },
            body: `[{ "product_id": ${id}, "channel_id": 1 }]`
        };
        const result = await fetch(createProductChannelAssignmentEndpoint, options)
    } catch(e){
        console.log('Error in "createProductChannelAssignment": ', e);
    }
}


/**
 * Sends GET to retrieve all categories on a store 
 * then find any existing categories that match the value given in "data.categoryName".
 * 
 * 
 * @param object data
 *   The object data retrieved from the product page scrape.
 *   - name: The name of the product being parsed through
 *   - img: The image of the product.
 *   - category: The category name.
 *   - price: The product price.
 * 
 */
export async function getCatIDFromCategories(data) {
    try {
        const categoriesEndpoint = `https://api.bigcommerce.com/stores/${data.storeHash}/v3/catalog/categories`;
        let options = {
            method: 'get',
            headers: { 'Content-Type': 'application/json', 'X-Auth-Token': data.bcAuthToken },
        };

        const result = await fetch(categoriesEndpoint, options);
        const json = await result.json();
        let categoriesArr = json.data;
        let getExistingCategoryID = (categoriesArr, name) => {
            let matchedCategories = categoriesArr.filter(function(category){
                return (category.parent_id === 0 && category.name === name);
            });
            
            if (matchedCategories.length === 1) {
                return matchedCategories[0].id;
            } else {
                console.log('Error: Category POST returned a 409 status but no matching category found in product catalog');
            }
        }
        let categoryID = getExistingCategoryID(categoriesArr, data.categoryName);
        await createProductInBigCommerce(data, categoryID);
    } catch(e){
        console.log('Error in "getCatIDFromCategories": ', e);
    }
}
