const fetch = require('node-fetch')
const formatQuery = require('./format-query')
const config = require('./config')
const apiHost = require('./api-host')

module.exports = function request (endpoint, opts = {}) {
  const { method, query, payload, headers, stream } = opts
  const queryString = formatQuery(query)

  const url = `${apiHost}/api${endpoint}${queryString}`

  return config.read()
    .then((obj) => {
      var _headers = headers || {}
      if (obj.token) _headers['Authorization'] = 'Bearer ' + obj.token

      let body
      if (payload) body = JSON.stringify(payload)
      if (stream) body = stream

      return fetch(url, {
        method: method || 'GET',
        headers: Object.assign({}, _headers, {
          'Content-Type': stream ? 'application/octet-stream' : 'application/json',
        }),
        body
      })
    })
    .then(res => {
      if (stream) {
        return res
      }

      return res.json()
        .then(json => {
          if (json.error) {
            return Promise.reject(json)
          }

          return json
        })
    })
}
