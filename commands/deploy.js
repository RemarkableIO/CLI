const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const fstream = require('fstream')
// const tar = require('tar')
const zlib = require('zlib')
const tar = require('tar-fs')


// const File = require('../utils/file')
const api = require('../utils/api')
const botConfig = require('../utils/bot-config')
// const checkNoBot = require('../utils/check-no-bot')

module.exports = function (subcommd, env) {
  // const packer = tar.Pack({ noProprietary: true })
  const gzip = zlib.createGzip()

  // const ignore = fs.readFileSync(path.resolve(process.cwd(), '.gitignore')).toString()

  console.log(process.cwd())
  const stream = tar.pack(path.resolve(process.cwd(), './'), {
      ignore: filterFile
    })
    .pipe(gzip)
    .on('error', (error) => {
      console.log(error)
    })

  botConfig.read()
    .then((config) => {
      return api.deploy(config.token, stream)
    })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
}

const blacklist = [
  '.git',
  'CVS',
  '.svn',
  '.hg',
  '.lock-wscript',
  '.wafpickle-N',
  '*.swp',
  '.DS_Store',
  '._*',
  'npm-debug.log'
]

function filterFile (file) {
  const splits = file.split('/')
  const last = splits[splits.length - 1]

  const exclude = blacklist.reduce((accum, blacklist) => {
    return accum || file.indexOf(blacklist) >= 0
  }, false)

  return exclude
}
