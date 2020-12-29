const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const {challengeSchema} = require('./challenge.embedded')

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
    unique: true
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

routeSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Route', routeSchema)