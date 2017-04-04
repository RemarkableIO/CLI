const inquirer = require('inquirer')

const api = require('../utils/api')
const config = require('../utils/config')

module.exports = function (subcommand, env) {
  console.log('Please log in to Remarkable.io:')

  collectCredentials()
    .then(({ email, password }) => {
      return api.authenticate(email, password)
    })
    .then(token => {
      if (!token.token) {
        return Promise.reject('\nAuthentication failed. Please try again.')
      }

      return config.saveToken(token.token)
    })
    .then(() => {
      console.log('\nSuccessfully authenticated with Remarkable.io.')
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
