const { Schema, model } = require('mongoose')

const schema = new Schema({
  qu: {
    type: String
  },
  au: {
    type: String
  },
  da: {
    type: String
  },
  ip: {
    type: String
  }
})

module.exports = model('quote', schema)