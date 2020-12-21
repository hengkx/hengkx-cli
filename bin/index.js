#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');

const image = require('../lib/image').default;

program.version(require('../package').version).usage('<command> [options]').parse(process.argv);

const [cmd] = program.args;

if (cmd === 'img' || cmd === 'image') {
  image();
}
