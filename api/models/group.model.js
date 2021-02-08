const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
    },
    currentChallenge: {
        type: Number,
        default: 1,
        required: true,
    },
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