const fs = require('fs')
const path = require('path')

class File {
  constructor(filePath) {
    if (typeof filePath === 'string') {
      this.filePath = filePath
    } else if (Array.isArray(filePath)) {
      this.filePath = path.resolve(filePath)
    } else {
      throw new Error('file path required, must be string or array')
    }
  }

  read () {
    return this._readFile().then((data) => {
      return this.deserialize(data)
    }).catch((err) => {
      return Promise.reject('Error reading file ' + this.filePath)
    })
  }

  write (blob) {
    const data = this.serialize(blob)
    return this._writeFile(data)
  }

  serialize(blob) {
    return blob
  }

  deserialize(blob) {
    return blob
  }

  remove() {
    return new Promise((resolve, reject) => {
      fs.unlink(this.filePath, (error) => {
        if (error) {
          return reject(error)
        }

        return resolve()
      })
    })
  }

  _serialize(json) {
    return JSON.stringify(json, null, 2) + '\n'
  }

  _readFile () {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, 'utf8', (error, data) => {
        if (error) {
          return reject(error)
        }

        return resolve(data)
      })
    })
  }

  _writeFile (data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, data, (error) => {
        if (error) {
          return reject(error)
        }

        return resolve(data)
      })
    })
  }
}

File.exists = function (filePath) {
  return new Promise((resolve, reject) => {
    fs.open(filePath, 'r', (error) => {
      if (error) {
        return resolve(false)
      }

      return resolve(true)
    })
  })
}

File.write = function (filePath, data) {
  const file = new File(filePath)
  return file.write(data)
}

File.read = function (filePath) {
  const file = new File(filePath)
  return file.read()
}

File.copy = function (sourcePath, targetPath, force = false) {
  // pretend file does not exist if force = true
  const checkExistence = force ? Promise.resolve(false) : File.exists(targetPath)

  return checkExistence
    .then((exists) => {
      if (exists) {
        return Promise.reject('file already exists')
      }

      return File.read(sourcePath)
        .catch((e) => { console.log(e) })
    })
    .then((file) => {
      return File.write(targetPath, file)
    })
}

File.mkdir = function (path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (error) => {
      if (error) {
        return reject(error)
      }

      return resolve(true)
    })
  })
}

module.exports = File
