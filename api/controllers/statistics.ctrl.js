const Game = require('../models/game.model');
const Route = require('../models/route.model');

exports.statisticsController = {
    getStatistics(req, res) {
        const gameId = req.params.id;
        console.log(gameId);
        res.send("work");
    },
}