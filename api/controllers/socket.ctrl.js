const socket = require('socket.io');
const Game = require('../models/game.model');
const Players = require('../utils/players');
const Games = require('../utils/games');
const { remove } = require('../models/game.model');

const lobbyPlayers = new Players();
const gamesIO = new Games();

exports.socketController = {
    setServer(server){
        const io = socket(server, { cors: { origin: '*' } });

        // Run when client connect
        io.on('connection', socket => {

            console.log(`Connected: ${socket.id}`);

            socket.on('adminJoinLobby', async ({ room }, callback) => {

                if(!room)
                    callback('Game not available!');
                else {
                    // Join the game room
                    const { error, newGame } = gamesIO.addGame( socket.id, 'Pregame', room );
                    if(error) return callback(error);
                    socket.join(room);
                }

            });

            socket.on('playerJoinLobby', async ({ playerData, gamePin }, callback) => {
            try
            {
                if(isNaN(gamePin))
                    callback('Invalid Game PIN');
                else {
                // Find the game ID by the provided game pin
                let games = await Game.find({ 'gamePin': gamePin }).populate('route');

                // If the game exists
                if(games.length > 0){
        
                    if(games[0].state == 'Pregame')
                    {
                        const room = (games[0]._id).toString();
                        
                        if(gamesIO.getGame(room))
                        {
                            const { error, newPlayer } = lobbyPlayers.addPlayer( socket.id, playerData, room );

                            if(error) return callback(error);

                            socket.emit('gameArea', { area: games[0].route.routeName});
                    
                            // Join the game room
                            socket.join(newPlayer.room)

                            // Notifying that the player has joined the lobby
                            io.in(newPlayer.room).emit('lobbyData', { room: newPlayer.room, players: lobbyPlayers.getPlayers(newPlayer.room) });
                            callback();
                        }
                        else
                            callback('Please wait for available admin')
                    } else 
                        callback('Game already started!')
                    
            
                } else callback('Game not available!');        
            }

            } catch (e) {
                callback('Error');
            }

            });

            socket.on('disconnect', () => {
                console.log(`Disconnected: ${socket.id}`);

                // Admin 
                const games = gamesIO.getGames(socket.id);
                if(games.length > 0)
                {
                    for(const game of games) {
                        console.log(game.state);
                        if(game.state === 'Pregame')
                        {
                            console.log("in")
                            socket.to(game.room).emit('joinAgain');
                            gamesIO.removeGame(game.room);
                        }
                    }
                    
                }
                else
                {
                    // Player 
                    const player = lobbyPlayers.removePlayer(socket.id);
                    if(player) {
                      socket.to(player.room).emit('lobbyData', { room: player.room, players: lobbyPlayers.getPlayers(player.room)});
                    }
                }
            })
        })
    }
}