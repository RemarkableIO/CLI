const fs = require('fs')
const path = require('path')
const File = require('./file')

describe('File', () => {
  const testFilePath = path.resolve('./tmp/test')
  const blob = 'blob'

  afterEach(() => {
    const file = new File(testFilePath)
    file.remove().catch(() => {})
  })

  it('should write a blob to a file', (done) => {
    const file = new File(testFilePath)

    const writeFile = file.write(blob)
    const readFile = _readFile(testFilePath)

    assert.eventually.equal(writeFile, blob, 'return value matches input')
    assert.eventually.equal(readFile, blob, 'read value matches input')
  })

  it('should read a blob from an existing file', (done) => {
    const file = new File(testFilePath)

    const writeFile = _writeFile(testFilePath, blob)
    const readFile = readFile(testFilePath)

    assert.eventually.equal(writeFile, blob, 'read value matches expected value')
  })
})

function _readFile (path) {
  return new Promsie((resolve, reject) => {
    fs.readFile(path, (error, file) => {
      if (error) {
        return reject(error)
      }

      return resolve(file)
    })
  })
}

function _writeFile (path, blob) {
  return new Promsie((resolve, reject) => {
    fs.writeFile(path, blob, (error) => {
      if (error) {
        return reject(error)
      }

      return resolve(blob)
    })
  })
}
