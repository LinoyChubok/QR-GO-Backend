const mongoose = require('mongoose')
const { challengeSchema } = require('./challenge.embedded')

const gameSchema = new mongoose.Schema({
    route: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Route',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    gameTime: { 
        hours: {
            type: Number,
            required: true,
            min: 0,
            max: 23
        },
        minutes: {
            type: Number,
            required: true,
            min: 0,
            max: 59
        },
    },
    groupsAmount: {
        type: Number,
        required: true,
        min: 2,
        default: 2
    },
    gamePin: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        enum: ["Pregame State", "Ingame State", "Endgame State"],
        default: "Pregame State",
        required: true,
    }
})

module.exports = mongoose.model('Game', gameSchema)