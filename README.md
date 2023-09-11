# BigC Mimic CLI
This CLI allows a developer to scrape an ecommerce page, send relevant HTML data to ChatGPT for analysis, and automatically create product data on a BigCommerce storefront. The purpose of this CLI is make it easier to mimic a store for the sake of testing and proof of concepts.

## Contents
- Installation Instructions
- Components of the CLI
    - Base CLI NPM Packages
        - Commander
        - Inquirer
        - Node FileSystem Module
    - Puppeteer
    - ChatGPT
    - BigCommerce API
- The Problem (Definition & Impact)
- The Solution (Hypothesis & Approach)

### Installation Instructions

Clone the repo:
`git clone https://github.com/glynnsanity/bigc-mimic.git`

NPM install globally :
`npm install -g`

Run `bigc-mimic init` and follow the prompts to add base config.

Run `bigc-mimic catscan` and follow prompts to execute a scan of a category page and upload of product data.

*Note*: There are console logs that are currently still in there for debugging - these are messy but are helpful in that they will output the initial response from ChatGPT and the filtered JSON that's being recorded and sent through the BigCommerce API

### Components of the CLI
- #### Base CLI NPM Packages
    - ##### Commander 
    https://www.npmjs.com/package/commander
    - ##### Inquirer
    https://www.npmjs.com/package//inquirer
    - ##### Node FileSystem Module
    https://nodejs.org/api/fs.html#filehandlereadfileoptions
    https://nodejs.org/api/fs.html#filehandlewritefiledata-options
- #### Puppeteer
https://www.npmjs.com/package/puppeteer

- #### ChatGPT
https://platform.openai.com/docs/guides/gpt/chat-completions-api

- #### BigCommerce API
https://developer.bigcommerce.com/docs/rest-catalog

### The Problem (Definition & Impact)
Loading data into a new BigCommerce storefront is cumbersome and time consuming. Even adding a single product with minimal data can take over roughly a minute and a half to configure. Multiply this by ~50 products when trying to create a real-life scenario storefront and we're looking at well over an hour of manual product catalog creation.

When specificially talking about BigCommerce Solutions Engineers, it can be particularly effective to have a storefront already customized to a merchant prospect's needed configuration in order to demonstrate the value of the platform for their use case. Currently accomplishing this is very difficult and as a result creates a large barrier for Solutions Engineers to implement.

### The Solution (Hypothesis & Approach)

