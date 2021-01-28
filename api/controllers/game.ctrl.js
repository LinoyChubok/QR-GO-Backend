const Game = require('../models/game.model');
const Route = require('../models/route.model');
const cryptoRandomString = require('crypto-random-string');

exports.gameController = {
    getAllGames(req, res) {
        Game.find().populate('route').then((games) => {
            res.status(200).json({
                games
            });
        }).catch(error => {
            res.status(500).json({
                status: false,
                message: 'Error while fetching games data'
            })
        });
    },
    getGame(req, res) {
        const gameId = req.params.id;

        Game.findById(gameId).then((game) => {
            res.status(200).json({
                game
            })
        }).catch(error => {
            res.status(500).json({
                status: false,
                message: 'Error while fetching game data'
            })
        });
    },
    createGame(req, res) {
        const { route, gameTime, groupsLimit } = req.body;

        Route.findById(route).then((route) => {
            if (!route) {
                return res.status(404).json({
                    status: false,
                    message: 'Route not found'
                })
            }
        }).then(async () => {
            if (route) {
                try {
                    const games = await Game.find({
                        $and: [{ "route": route }, { $or: [{ 'state': "Pregame State" }, { "state": "Ingame State" }] }]
                    });
                    let status = true;

                    if (Array.isArray(games)) {
                        if (games.length > 0)
                            status = false;
                    } else if (games)
                        status = false;

                    if (!status) {
                        return res.status(500).json({
                            status: false,
                            message: 'There is already other game that started at this route'
                        });
                    }

                    const ensurePin = async () => {
                        let gamePin;
                        let validPin = false;

                        while (!validPin) {
                            gamePin = cryptoRandomString({ length: 4, type: 'numeric' });

                            validPin = await Game.find({
                                'state': 'Pregame State',
                                'gamePin': gamePin
                            }).then((activeGames) => {
                                    if (Array.isArray(activeGames)) {
                                        if (!(activeGames.length > 0))
                                            validPin = true;
                                    } else if (!activeGames)
                                        validPin = true;
                            
                                    return validPin;
                                });
                        }

                        const newGame = new Game({
                            route,
                            gameTime,
                            groupsLimit,
                            gamePin
                        });

                        newGame.save();

                        res.status(200).json({
                            status: true,
                            message: 'Game has been created successfuly'
                        });
                    };

                    ensurePin();
                } catch (error) {
                    res.status(500).json({
                        status: false,
                        message: 'Error please fill all the fields correctly'
                    });
                }
            }
        })
    },
    updateGame(req, res) {
        const gameId = req.params.id;

        let gameObj;

        Game.findById(gameId).then((game) => {
            gameObj = game;
            if (!game) {
                return res.status(404).json({
                    status: false,
                    message: 'Game not found'
                })
            }
        }).then((result) => {

            const { route, gameTime, groupsLimit, state } = req.body;

            let status = true;

            if (gameObj.state == "Pregame State") {
                if (route || gameTime || groupsLimit || state) {

                    if (route) {
                        Route.findById(route).then((route) => {
                            if (!route) {
                                status = false;
                            }
                        }).then(async () => {
                            const games = await Game.find({
                                $and: [{ "route": route }, { $or: [{ 'state': "Pregame State" }, { "state": "Ingame State" }] }]
                            });
                            let status = true;
                            if (Array.isArray(games)) {
                                if (games.length > 0)
                                    status = false;
                            } else if (games)
                                status = false;
                            if (!status) {
                                return res.status(500).json({
                                    status: false,
                                    message: 'There is already other game that started at this route'
                                });
                            }
                        })
                    }
                    
                    if (groupsLimit < 2)
                        status = false;

                    if (gameTime) {

                        let gameTimeLength = 0;

                        for (key in gameTime)
                            gameTimeLength++;

                        if (gameTimeLength == 2) {
                            if (gameTime.hasOwnProperty("hours") && gameTime.hasOwnProperty("minutes")) {
                                const hours = gameTime["hours"];
                                const minutes = gameTime["minutes"];

                                if (!((hours >= 0 && hours <= 23) &&
                                        (minutes >= 0 && minutes <= 59)))
                                    status = false;
                                else if (!hours && !minutes)
                                    status = false;
                            } else
                                status = false;
                        } else
                            status = false;
                    }

                    if (state) {
                        if (state != "Ingame State")
                            status = false;
                    }

                } else status = false;
            } else if (gameObj.state == "Ingame State") {
                if (state) {
                    if (state != "Endgame State")
                        status = false;

                    if (route || gameTime || groupsLimit) {
                        return res.status(500).json({
                            status: false,
                            message: 'Game already started cannot update'
                        })
                    }
                }
            } else if (gameObj.state == "Endgame State") {
                if (route || gameTime || groupsLimit || state) {
                    return res.status(500).json({
                        status: false,
                        message: 'Game already started cannot update'
                    })
                }
            }

            if (!status) {
                res.status(500).json({
                    status: false,
                    message: 'Error incorrect values'
                });
            } else {
                Game.updateOne({ _id: gameId },
                { $set: { ...req.body }
                }).then(() => {
                    res.status(200).json({
                        status: true,
                        message: `Game _id: ${gameId} has been updated successfuly`
                    })
                }).catch(error => {
                    res.status(500).json({
                        status: false,
                        message: 'Error while updating game'
                    })
                });
            }
        })
    },
    deleteGame(req, res) {
        const gameId = req.params.id;

        Game.findOneAndDelete({
            _id: gameId
        }).then((game) => {
            res.status(200).json({
                status: true,
                message: `Game _id: ${gameId} has been deleted successfuly`
            })
        }).catch(error => {
            res.status(500).json({
                status: false,
                message: 'Error while deleting game'
            })
        });
    }
}