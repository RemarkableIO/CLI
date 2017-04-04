#!/usr/bin/env node

const program = require('commander')

program.version('0.1.0')

// Commands
const create = require('./commands/create')
const clone = require('./commands/clone')
const login = require('./commands/login')
const start = require('./commands/start')
const ping = require('./commands/ping')
const deploy = require('./commands/deploy')

const collect = (value, collection) => {
  return collection.concat([value])
}

program
  .command('create [name]')
  .description('Create a new bot saved in the current directory')
  .action(create)

program
  .command('clone [token]')
  .description('Clone an existing bot into the current directory')
  .action(clone)

program
  .command('login')
  .description('Login to Remarkable.io')
  .action(login)

program
  .command('start')
  .description('Start your bot locally')
  .action(start)

program
  .command('deploy')
  .option('-i, --ignore [files]', 'Ignore files', collect, [])
  .description('Deploy bot and config')
  .action(deploy)

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

  console.log(`[remarkable] Error: command '${cmd}' not found`)
}

program.help()
process.exit(1)
