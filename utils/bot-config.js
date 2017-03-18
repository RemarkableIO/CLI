const JSONFile = require('./json-file')
const path = require('path')

class BotConfig extends JSONFile {
  constructor(stub) {
    const workingDir = process.cwd()
    const botConfigPath = path.resolve(workingDir, 'bot.json')

    super(stub || botConfigPath)
  }
}

module.exports = new BotConfig()
