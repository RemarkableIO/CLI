const fetch = require('node-fetch')
const formatQuery = require('./format-query')
const config = require('./config')
const apiHost = require('./api-host')

module.exports = function request (endpoint, opts = {}) {
  const { method, query, payload, headers } = opts
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
        credentials: 'same-origin',
        headers: Object.assign({}, _headers, {
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(payload)
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
