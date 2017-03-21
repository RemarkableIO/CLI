const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')

const File = require('../utils/file')
const api = require('../utils/api')
const botConfig = require('../utils/bot-config')
const apiHost = require('../utils/api-host')
const REQUIRED_TOKENS = require('../utils/required-tokens')

module.exports = function create (name, env) {
  checkNoBot()
    .then(collectOptions(name))
    .then(api.createBot)
    .then(writeBotConfigFile)
    .then(maybeWriteExampleScript)
    .then(maybeWriteExternalScripts)
    .then((bot) => {
      const { name, token, adapter } = bot
      const url = `${apiHost}/bot/${token}`

      console.log(`
  Successfully created ${adapter} bot '${name}'!

    Name: ${name}
    Adapter: ${adapter}
    See more: ${url}

  Create new scripts by adding files to the /scripts
  directory, and they'll automatically be loaded when
  the bot starts up. Check out /scripts/greeting.js
  for an example, or see hubot script documentation:
  https://hubot.github.com/docs/scripting/
`)
      process.exit()
    })
    .catch((error) => {
      console.log('remarkable: failed to create bot.', error)
      process.exit()
    })
}

const prompt = inquirer.createPromptModule()

function checkNoBot () {
  return File.exists('./bot.json')
    .then((exists) => {
      if (exists) {
        return Promise.reject('bot.json already exists in this directory.')
      }

      return Promise.resolve()
    })
}

function collectBasicInfo (name) {
  console.log(`
  Create a bot.json file

  This will guide you through creating and
  configuring a new chat bot on Remarkable.io.

  Let's get started.
`)

  const questions = [
    {
      type: 'input',
      name: 'name',
      default: name,
      message: 'What would you like to call the bot?'
    },
    {
      type: 'list',
      name: 'adapter',
      choices: ['telegram', 'slack'],
      message: 'Where do you want to chat with your bot?'
    },
  ]

  return prompt(questions)
}

function collectAdapterTokens (adapter) {
  const questions = REQUIRED_TOKENS[adapter].map(requirement => {
    const { name, title, url, placeholder } = requirement

    const message = `Please obtain a ${title} (${url}) and enter it here:\n`

    return {
      type: 'input',
      name: requirement.name,
      message: message,
      default: placeholder
    }
  })

  return prompt(questions)
}

function collectOptions (name) {
  return () => {
    return collectBasicInfo(name)
      .then((basicInfo) => {
        return Promise.all([basicInfo, collectAdapterTokens(basicInfo.adapter)])
      })
      .then(([basicInfo, adapterTokens]) => {
        return Object.assign({}, basicInfo, { adapterTokens })
      })
    }
}

function writeBotConfigFile (bot) {
  return botConfig.write({
    name: bot.name,
    token: bot.token,
    adapter: bot.adapter,
    adapterTokens: bot.adapterTokens
  }, true)
}

function maybeWriteExampleScript (bot) {
  const exampleTemplatePath = path.resolve(__dirname, '../templates/example.js')
  const scriptsDir = path.resolve(process.cwd(), 'scripts')
  const exampleScriptPath = path.resolve(scriptsDir, 'example.js')

  return File.exists(scriptsDir)
    .then((exists) => {
      if (!exists) {
        return File.mkdir(scriptsDir)
      }

      return true
    })
    .then(() => {
      return File.copy(exampleTemplatePath, exampleScriptPath, false)
    })
    .then(() => {
      return bot
    })
}

function maybeWriteExternalScripts (bot) {
  const externalScriptsTemplatePath = path.resolve(__dirname, '../templates/external-scripts.json')
  const externalScriptsPath = path.resolve(process.cwd(), 'external-scripts.json')

  return File.copy(externalScriptsTemplatePath, externalScriptsPath, false)
    .then(() => {
      return bot
    })
}
