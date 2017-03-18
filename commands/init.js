const inquirer = require('inquirer')
const api = require('../utils/api')
const botConfig = require('../utils/bot-config')
const apiHost = require('../utils/api-host')

const REQUIRED_TOKENS = {
  telegram: [
    {
      name: 'TELEGRAM_TOKEN',
      title: 'telegram bot token',
      placeholder: 'fake56789:9esMWJfkQr9rWHBqcN2uJnrRYeGL2MT6XGs',
      url: 'https://telegram.me/botfather'
    }
  ],
  slack: [
    {
      name: 'HUBOT_SLACK_TOKEN',
      title: 'slack bot token',
      placeholder: 'fake-123456789012-oJsNfBU2KvBUwiw7JcxUU7Qj',
      url: 'https://my.slack.com/services/new/bot'
    }
  ]
}
const prompt = inquirer.createPromptModule()

module.exports = function init (subcommand, env) {
  process.stdout.write(`Let's build a bot:\n`)

  collectBasicInfo()
    .then((basicInfo) => {
      return Promise.all([basicInfo, collectAdapterTokens(basicInfo.adapter)])
    })
    .then(([basicInfo, adapterTokens]) => {
      const payload = Object.assign({}, basicInfo, { adapterTokens })

      return api.createBot(payload)
    })
    .then((bot) => {
      return botConfig.write({
        name: bot.name,
        token: bot.token,
        adapter: bot.adapter,
        adapterTokens: bot.adapterTokens
      })
    })
    .then((bot) => {
      const { name, token, adapter } = bot
      const url = `${apiHost}/bot/${token}`

      process.stdout.write(`Successful created ${adapter} bot named ${name}: ${url}\n`)
      process.exit()
    })
    .catch((error) => {
      console.log(error)
      process.stdout.write('Something went wrong.\n')
      process.exit()
    })
}

function collectBasicInfo () {
  const questions = [
    {
      type: 'input',
      name: 'name',
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
