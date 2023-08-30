#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

program
    .command('init', 'Ready to mimic')
    .command('catscan', 'Get category products!' )
    .parse(process.argv);