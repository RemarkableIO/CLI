const JSONFile = require('./json-file')
const path = require('path')

class Config extends JSONFile {
  constructor(stub) {
    const Home = process.env.HOME || process.env.USERPROFILE
    const configPath = path.resolve(Home, '.remarkable.json')

    super(stub || configPath)
  }

  read () {
    return JSONFile.prototype.read.call(this).catch(() => ({}))
  }

  saveToken(token) {
    return this.write({ token })
  }
}

module.exports = new Config()
