const File = require('./file')

class JSONFile extends File {
  serialize(json) {
    return JSON.stringify(json, null, 2) + '\n'
  }

  deserialize(data) {
    return JSON.parse(data)
  }

  read () {
    return this._readFile().then((data) => {
      return this.deserialize(data)
    })
  }

  write(newJson, replace = false) {
    if (replace) {
      const data = this.serialize(newJson)
      return this._writeFile(data).then(() => (newJson))
    } else {
      return this.read()
        .then((oldJson) => {
          const json = Object.assign({}, oldJson, newJson)
          const data = this.serialize(json)

          return this._writeFile(data).then(() => (json))
        })
    }
  }
}

module.exports = JSONFile
