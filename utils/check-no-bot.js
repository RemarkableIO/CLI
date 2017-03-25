const File = require('./file')

module.exports = function checkNoBot () {
  return File.exists('./bot.json')
    .then((exists) => {
      if (exists) {
        return Promise.reject('bot.json already exists in this directory.')
      }

      return Promise.resolve()
    })
}
