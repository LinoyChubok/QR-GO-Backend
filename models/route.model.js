const mongoose = require('mongoose')
const {challengeSchema} = require('challenge.embedded')

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    enum: ["Northern District", "Haifa District", "Central District", "Tel Aviv District", "Jerusalem District", "Southern District"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  challengesAmount: {
    type: Number,
    required: true,
  },
  challenges: 
    [challengeSchema]
})

module.exports = mongoose.model('Route', routeSchema)