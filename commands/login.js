const inquirer = require('inquirer')
const api = require('../utils/api')
const config = require('../utils/config')

module.exports = function login (subcommand, env) {
  console.log('Please log in to Remarkable.io:')

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
      console.log('Successfully authenticated with Remarkable.io.\n')
      process.exit()
    })
    .catch((error) => {
      console.log(error)
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
