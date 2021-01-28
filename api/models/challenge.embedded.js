const mongoose = require('mongoose')

const challengeSchema = new mongoose.Schema({
  qrData: {
    type: String,
    required: true
  },
  qrUrl: {
    type: String,
    required: true
  },
  clue: {
    type: String,
    required: true
  },
  coordinate: 
  {
    longitude:{
        type: Number,
        required: true
    },
    latitude:{
        type: Number,
        required: true
    }
  }
})

module.exports = {challengeSchema};