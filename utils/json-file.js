const fs = require('fs')

class JSONFile {
  constructor(filePath) {
    this.filePath = filePath
  }

  read () {
    return this._readFile().then((file) => {
      return JSON.parse(file)
    }).catch(() => {
      return Promise.resolve({})
    })
  }

  write (obj) {
    return this.read()
      .then((json) => {
        const newJSON = Object.assign({}, json, obj)
        const blob = this._serialize(newJSON)
        return this._writeFile(blob)
      })
  }

  _serialize(json) {
    return JSON.stringify(json, null, 2) + '\n'
  }

  _readFile () {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, (error, file) => {
        if (error) {
          return reject(error)
        }

        return resolve(file)
      })
    })
  }

  _writeFile (blob) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, blob, (error) => {
        if (error) {
          return reject(error)
        }

        return resolve(JSON.parse(blob))
      })
    })
  }
}

module.exports = JSONFile
