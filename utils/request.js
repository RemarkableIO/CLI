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

      if (obj.token) {
        _headers['Authorization'] = 'Bearer ' + obj.token
      }

      return fetch(url, {
        method: method || 'GET',
        headers: Object.assign({}, _headers, {
          'Content-Type': stream ? null : 'application/json',
        }),
        body: stream || JSON.stringify(payload)
      })
    })
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        return Promise.reject(json)
      }

      return json
    })
}
