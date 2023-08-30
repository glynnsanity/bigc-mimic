#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";

async function save(answers) {
    if (answers.gptApiKey && answers.storeHash && answers.bcAuthToken) {
        await fs.promises.writeFile('.config.bigcmimic.json', JSON.stringify(
            [
                { "gptApiKey": `${ answers.gptApiKey }` },
                { "storeHash": `${ answers.storeHash }` },
                { "bcAuthToken": `${ answers.bcAuthToken }` }
            ])
        );
    } else {
        console.log('You entered invalid inputs');
        startPrompt();
    }
}

async function startPrompt() {
    inquirer.prompt([{ 
        "type": "input", 
        "message": "Enter your ChatGPT API Key. If you don't have an API key, you'll need to sign up for a paid account with ChatGPT.",
        "name": "gptApiKey", 
    }, {
        "type": "input", 
        "message": "Enter the storefront hash that you want to push product data to:",
        "name": "storeHash",
    },
    {
        "type": "input", 
        "message": "Enter the auth token for your storefront:",
        "name": "bcAuthToken",
    }
    ])
    .then((answers) => {
        save(answers);
        console.log('Success :)')
    })
}

startPrompt();