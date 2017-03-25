const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')

const File = require('../utils/file')
const api = require('../utils/api')
const botConfig = require('../utils/bot-config')
const checkNoBot = require('../utils/check-no-bot')

// module.exports = function login (token, env) {
//   if (!token) {
//     return checkNoBot()
//       .then(api.fetchBots)
//       .then(selectBot)
//     .then(cloneBot)
//       .then(writeBotConfigFile)
//       .then(writeScripts)
//       .then(writeExternalScripts)
//       .then((config) => {
//         const { name, token, adapter } = config

//         console.log(`remarkable: successfully cloned ${adapter} bot '${name}'!`)
//       })
//       .catch(e => {
//         console.log(e)
//       })
//   }

//   return checkNoBot().then(() => {
//     return cloneBot({ token })
//   })
// }

// const prompt = inquirer.createPromptModule()

// function selectBot (bots) {
//   const choices = bots.map(bot => ({
//     name: `${bot.token}: ${bot.name}`,
//     value: bot.token
//   }))

//   const questions = [
//     {
//       type: 'list',
//       name: 'token',
//       choices: choices,
//       message: 'Please select a bot to clone:'
//     },
//   ]

//   return prompt(questions)
// }

// function writeBotConfigFile (config) {
//   return botConfig.write(config, true)
// }

// function writeScripts (config) {
//   const exampleTemplatePath = path.resolve(__dirname, '../templates/example.js')
//   const scriptsDir = path.resolve(process.cwd(), 'scripts')
//   const exampleScriptPath = path.resolve(scriptsDir, 'example.js')

//   return File.exists(scriptsDir)
//     .then((exists) => {
//       if (!exists) {
//         return File.mkdir(scriptsDir)
//       }

//       return true
//     })
//     .then(() => {
//       return File.copy(exampleTemplatePath, exampleScriptPath, false)
//     })
//     .then(() => {
//       return bot
//     })
// }

// function writeExternalScripts (bot) {
//   const externalScriptsTemplatePath = path.resolve(__dirname, '../templates/external-scripts.json')
//   const externalScriptsPath = path.resolve(process.cwd(), 'external-scripts.json')

//   return File.copy(externalScriptsTemplatePath, externalScriptsPath, false)
//     .then(() => {
//       return bot
//     })
// }
