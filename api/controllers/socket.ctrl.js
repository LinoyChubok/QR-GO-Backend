const socket = require('socket.io');

const Players = require('../utils/players');
const Games = require('../utils/games');

const Group = require('../models/group.model');
const Game = require('../models/game.model');

const GroupMaker = require('group');

const User = require('../models/user.model')

const lobbyPlayers = new Players();
const gamesIO = new Games();

exports.socketController = {
    setServer(server){
        const io = socket(server, { cors: { origin: '*' } });

        // Run when client connect
        io.on('connection', socket => {

            console.log(`Connected: ${socket.id}`);

            // Admin events
            socket.on('adminJoinLobby', ({ room }, callback) => {

                if(!room)
                    callback('Game not available!');
                else {
                    // Join the game room
                    const { error, newGame } = gamesIO.addGame( socket.id, 'Pregame', room );
                    if(error) return callback(error);
                    socket.join(room);
                }

            });

            socket.on('startGame', async ({ room }, callback) => {

                if(!room)
                    callback('Game not available!');
                else {
                  try {
                    let game = await Game.findById(room).populate('route')

                    const playersPerGroup = game.groupsAmount;
                    const currentPlayers = lobbyPlayers.getPlayers(room);
        
                    // const groups = Group.fromArray(currentPlayers, playersPerGroup);
                    let groups;
                    let groupsAmount = 0;

                    if(currentPlayers.length > 0)
                    {
                        groups = GroupMaker.fromArray(currentPlayers, 1);
                        groupsAmount = groups.length;
                    }
             
                    if(groupsAmount == 1 || groupsAmount == 0)
                        callback('No enough players for starting the game');
                    else
                    {
                        for(let i = 0 ; i < groupsAmount ; i++)
                        {
                            // Create new group
                            const newGroup = new Group({
                                groupName : `Group_${i+1}`,
                                game : room
                            });
                            
                            newGroup.save();

                            // Add players to group
                            const playersOfGroup = groups[i];
                            for(player of playersOfGroup)
                            {
                                let users = await User.find({ 'googleId': player.googleId });

                                // If user exists
                                if(users.length > 0)
                                {
                                    User.updateOne({_id: users[0]._id }, { $set: { 'group' : newGroup._id } })
                                }
                            }
                        }
                        callback();
                    }    

                    } catch (e) {
                        callback('Error');
                    }
                }

            });

            // Player events
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
                        if(game.state === 'Pregame')
                        {
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