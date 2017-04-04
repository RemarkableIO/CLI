const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const tarStream = require('tar-stream')
const tarFs = require('tar-fs')
const gunzip = require('gunzip-maybe')
const concatStream = require('concat-stream')
// const File = require('../utils/file')
const api = require('../utils/api')
const botConfig = require('../utils/bot-config')
// const checkNoBot = require('../utils/check-no-bot')

module.exports = function (token, env) {
  getBotTokenOrFallback(token)
    .then(api.clone)
    .then((response) => {
      const extract = tarFs.extract(process.cwd(), {
        map: (header) => {
          console.log(header.name)

          return Object.assign({}, header, {
            name: header.name.slice(4) // Offset to account for bot/
          })
        }
      })

      response.body
        .pipe(gunzip())
        .pipe(extract)
    })
    .catch(error => {
      console.log(error)
    })
}

function getBotTokenOrFallback (fallback) {
  return botConfig.read()
    .then(config => config.token || fallback)
    .catch(() => {
      if (fallback) {
        return fallback
      }

      return api.fetchBots()
        .then(selectBot)
        .then(bot => bot.token)
    })
}

function selectBot (bots) {
  const prompt = inquirer.createPromptModule()

  const choices = bots.map(bot => ({
    name: `${bot.token}: ${bot.name}`,
    value: bot.token
  }))
  const questions = [
    {
      type: 'list',
      name: 'token',
      choices: choices,
      message: 'Please select a bot to clone:'
    },
  ]
  return prompt(questions)
}

