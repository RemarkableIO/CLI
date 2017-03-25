const formatQuery = require('../utils/format-query')
const request = require('../utils/request')

class RemarkableAPI {
  constructor () {
    this.sockets = {}
  }

  createUser (name, email, password) {
    return request('/user/create', {
      method: 'POST',
      payload: { name, email, password }
    })
  }

  authenticate (email, password) {
    return request('/user/tokens', {
      method: 'POST',
      payload: { email, password }
    })
  }

  check () {
    return request('/user/tokens/check')
  }

  logout () {
    return request('/user/logout', {
      method: 'POST'
    })
  }

  fetchBots () {
    return request('/bots')
  }

  fetchBot (token) {
    return request(`/bot/${token}`)
  }

  fetchBotConfig (token) {
    return request(`/bot/${token}/config`)
  }

  createBot (botConfig) {
    return request('/bot/create', {
      method: 'POST',
      payload: botConfig
    })
  }

  deleteBot (token, confirmation) {
    return request(`/bot/${token}`, {
      method: 'DELETE',
      query: { confirmation }
    })
  }

  addScript (token, script) {
    const scripts = [{
      name: script,
      source: 'npm',
    }]

    return request(`/bot/${token}/scripts`, {
      method: 'PUT',
      payload: { scripts }
    })
  }

  removeScript (token, script) {
    return request(`/bot/${token}/scripts`, {
      method: 'DELETE',
      payload: {
        scripts: [script]
      }
    })
  }

  deploy (token, stream) {
    return request(`/bot/${token}/deploy`, {
      method: 'PUT',
      stream
    })
  }

  searchPackages (query) {
    return request('/packages/search', {
      query: { text: query }
    })
  }

  updateBot (token, botConfig) {
    return request(`/bot/${token}/settings`, {
      method: 'PUT',
      payload: {
        bot: botConfig
      }
    })
  }

  connectToBot (bot) {
    const { token, container } = bot

    if (this.sockets[token]) {
      this.disconnect(token)
    }

    this.sockets[token] = SocketIO(`/inspect?token=${token}`)

    this.sockets[token].on('connect', () => {
      console.log('Connected to bot', token)
    })

    this.sockets[token].on('disconnect', () => {
      console.log('Disconnected from bot', token)
    })

    return new BotConnection(bot, this.sockets[token])
  }

  disconnect (token) {
    if (this.sockets[token]) {
      this.sockets[token].removeAllListeners('status')
      this.sockets[token].destroy()
    }
  }
}

const remarkable = new RemarkableAPI()

module.exports = remarkable
