const api = require('../utils/api')
const apiHost = require('../utils/api-host')

module.exports = function (subcommand, env) {
  api.check()
    .then((success) => {
      console.log(`You are authenticated with ${apiHost}.`)
      process.exit()
    })
    .catch((error) => {
      console.log('Failed to check authentication with Remarkable.io.')
      process.exit()
    })
}
