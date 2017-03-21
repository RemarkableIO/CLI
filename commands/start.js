const exec = require('child_process').exec
const path = require('path')

const botConfig = require('../utils/bot-config')

module.exports = function start (subcommand, env) {
  botConfig.read()
    .then((config) => {
      const nodeModulesPath = path.resolve(__dirname, '../node_modules')
      const binPath = path.resolve(nodeModulesPath, './.bin/hubot')

      const paths = [
        path.resolve(nodeModulesPath, './hubot/bin'),
        path.resolve(nodeModulesPath, './coffee-script/bin')
      ].join(':')

      const options = `--name "${config.name}" --adapter "${config.adapter}"`
      const command = `export PATH="${paths}:$PATH"; ${binPath} ${options}`

      const runProcess = exec(command, {
        cwd: process.cwd(),
        env: Object.assign({}, config.adapterTokens, {
          BLANKBOT_TOKEN: config.token,
        })
      }, (error) => {
        console.log('exited', error)
      })

      runProcess.stdout.pipe(process.stdout)
      runProcess.stderr.pipe(process.stderr)
    })
    .catch(() => {
      console.log('remarkable: bot.json not found. Did you mean to run this inside a bot project directory?')
    })
}
