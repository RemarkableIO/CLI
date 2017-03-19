module.exports = function (robot) {
  robot.respond(/hello (.*)/i, (res) => {
    const name = res.match[1]

    if (name) {
      res.send(`Why on earth are you greeting ${name}? That's not my name!`)
    } else {
      res.send(randomGreeting())
    }
  })
}

function randomGreeting () {
  const greetings = [
    "Hello",
    "Hello there.",
    "Hi",
    "Hi there.",
    "Hey",
    "Good day",
    "Pleased to meet you",
    "How are things?",
    "Hiya",
    "Sup?",
    "What's up?",
    "Whasssup?",
    "How's it going?",
    "Howdy",
    "Well hello!",
    "Yo",
    "Greetings!",
    "Look who it is!"
  ]

  const random = Math.floor(getRandomArbitrary(0, greetings.length))

  return greetings[random]
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}
