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
#### Base CLI NPM Packages
##### Commander
##### Inquirer
##### Node FileSystem Module
#### Puppeteer
#### ChatGPT
#### BigCommerce API
### The Problem (Definition & Impact)
### The Solution (Hypothesis & Approach)

### 