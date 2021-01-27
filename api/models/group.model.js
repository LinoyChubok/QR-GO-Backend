const mongoose = require('mongoose')
const { challengeSchema } = require('./challenge.embedded')

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
    },
    players: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
    },
    currentChallenge: {
        type: Number,
        default: 1,
        required: true,
    },
    challenges: 
    [challengeSchema]
    ,
    challengesTime: {
        type: [Date],
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    }
})

module.exports = mongoose.model('Group', groupSchema)