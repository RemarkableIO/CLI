#!/usr/bin/env node

const program = require('commander')

program.version('0.1.0')

// Commands
const init = require('./commands/init')
const login = require('./commands/login')
const start = require('./commands/start')
const ping = require('./commands/ping')

program
  .command('init [name]')
  .description('Create a new bot in the working directory')
  .action(init)

program
  .command('login')
  .description('Login to Remarkable.io')
  .action(login)

program
  .command('start')
  .description('Start running your bot locally')
  .action(start)

program
  .command('ping')
  .description('Check authentication')
  .action(ping)

program
  .command('help')
  .description('Print this help text')
  .action(() => {
    program.help()
  })

program.parse(process.argv)

const cmds = program.commands.map(c => c._name)

if (cmds.indexOf(process.argv[2]) > -1) {
  return
}

if (process.argv.length > 2) {
  const cmd = process.argv[2]

  process.stdout.write(`[remarkable] Error: command '${cmd}' not found\n`)
}

program.help()
process.exit(1)