const info = (...params) => {
  if(process.env.TESTING !== 'true') {
    console.log(...params)
  }
}

const error = (...params) => {
  if(process.env.TESTING !== 'true') {
    console.error(...params)
  }
}

module.exports = { info, error }