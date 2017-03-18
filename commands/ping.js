const api = require('../utils/api')

module.exports = function login (subcommand, env) {
  api.check()
    .then((success) => {
      console.log('You are authenticated with Remarkable.io.')
      process.exit()
    })
    .catch((error) => {
      console.log('Failed to check authentication with Remarkable.io.')
      process.exit()
    })
}
