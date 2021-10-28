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
  ha: {
    type: Number
  }
})

module.exports = model('quote', schema)