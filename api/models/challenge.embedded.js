const mongoose = require('mongoose')

const coordinateSchema = new mongoose.Schema({
    longitude:{
        type: Number,
        required: true
    },
    latitude:{
        type: Number,
        required: true
    }
});

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
    coordinateSchema
 ,
  challengeRadius: {
      type: Number,
      required: false
  }
})

module.exports = {challengeSchema};