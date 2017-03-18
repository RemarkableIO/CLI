const inquirer = require('inquirer')
const api = require('../utils/api')
const config = require('../utils/config')

module.exports = function login (subcommand, env) {
  process.stdout.write('Please log in to Remarkable.io:\n')

  collectCredentials()
    .then(({ email, password }) => {
      return api.authenticate(email, password)
    })
    .then(token => {
      if (!token.token) {
        return Promise.reject('Authentication failed. Please try again.\n')
      }

      return config.saveToken(token.token)
    })
    .then(() => {
      process.stdout.write('Successfully authenticated with Remarkable.io.\n')
      process.exit()
    })
    .catch((error) => {
      process.stdout.write('Authentication failed. Please try again.\n')
      process.exit()
    })
}

function collectCredentials () {
  const prompt = inquirer.createPromptModule()

  const questions = [
    {
      type: 'input',
      name: 'email',
      message: 'Email Address:'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password:'
    }
  ]

  return prompt(questions)
}
