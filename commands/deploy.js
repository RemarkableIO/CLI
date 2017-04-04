const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const fstream = require('fstream')
const concatStream = require('concat-stream')
const zlib = require('zlib')
const tar = require('tar-fs')


// const File = require('../utils/file')
const api = require('../utils/api')
const botConfig = require('../utils/bot-config')
// const checkNoBot = require('../utils/check-no-bot')

module.exports = function (env) {
  // const packer = tar.Pack({ noProprietary: true })
  const gzip = zlib.createGzip()

  console.log(env)

  // const ignore = fs.readFileSync(path.resolve(process.cwd(), '.gitignore')).toString()

  console.log(process.cwd())
  const stream = tar.pack(path.resolve(process.cwd(), './'), {
    ignore: filterFile(env.ignore)
  }) //.pipe(gzip)

  // stream.on('data', (data) => {
  //   console.log(data.toString())
  // })

  // stream.on('end', (error) => {
  //   console.log('end stream')
  // })
  // stream.on('error', (error) => {
  //     console.log('error')
  //     console.log(error)
  //   })

  // botConfig.read()
  //   .then((config) => {
  //     return deployBot(config.token, stream)
  //   })
  //   .then((response) => {
  //     return response
  //   })

  //   .catch((error) => {
  //     console.log(error)
  //   })
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

function filterFile (paths) {
  return (file) => {
    const splits = file.split('/')
    const last = splits[splits.length - 1]

console.log(file)
    const exclude = blacklist.reduce((accum, blacklist) => {
      return accum || file.indexOf(blacklist) >= 0
    }, false)

    return exclude
  }
}

function deployBot (token, stream) {
  return api.deploy(token, stream)
    .then((response) => {
      return parseJSONResponse(response)
    })
}

function parseJSONResponse (response) {
  return new Promise((resolve, reject) => {
    const concat = concatStream((data) => {
      resolve(data.toString())
    })

    response.body.on('error', reject)
    response.body.pipe(concat)
  })
}
