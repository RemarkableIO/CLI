module.exports = function formatQuery (query) {
  if (!query) { return '' }

  return Object.keys(query)
    .reduce((accum, key, i) => {
      const prefix = i === 0 ? '?' : '&'
      const value = encodeURIComponent(query[key])

      return `${accum}${prefix}${key}=${value}`
    }, '')
}
