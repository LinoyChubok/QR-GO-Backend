const socket = require('socket.io');

const Players = require('../utils/players');
const Games = require('../utils/games');

const Group = require('../models/group.model');
const Game = require('../models/game.model');

const GroupMaker = require('group');

const User = require('../models/user.model')

const lobbyPlayers = new Players();
const activeGames = new Games();

const Event = require('../utils/events').eventBus;

let g_socket;
let g_io;

exports.socketController = {
    setServer(server){
        const io = socket(server, { cors: { origin: '*' } });
        g_io = io;

        // Run when client connect
        io.on('connection', socket => {

            g_socket = socket;

            console.log(`Connected: ${socket.id}`);

            // Admin events
            socket.on('adminJoinLobby', async ({ room }, callback) => {

                if(!room)
                    callback('Game not available!');
                else {
                    let game = await Game.findById(room);

                    if(game.state != 'Pregame')
                    {
                        callback("This game already started. You can see the statistics of each game at Endgame state only.");
                    }
                    else
                    {
                        // Join the game room
                        const { error, newGame } = activeGames.addGame( socket.id, 'Pregame', room );
                        if(error) return callback(error);
                        socket.join(room);
                    }
                }

            });

            socket.on('startGame', async ({ room }, callback) => {

                if(!room)
                    callback('Game not available!');
                else {
                  try {
                    let game = await Game.findById(room);

                    const playersPerGroup = game.groupsAmount;
                    const currentPlayers = lobbyPlayers.getPlayers(room);
        
                    let groups;
                    let groupsAmount = 0;

                    if(currentPlayers.length > 0)
                    {
                        //groups = GroupMaker.fromArray(currentPlayers, playersPerGroup);
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
                                    User.updateOne({ _id: users[0]._id }, { $set: { 'group' : newGroup._id }}).then(() => {
                                    }).catch(error => {
                                        console.log(error);
                                    });
                                }
                            }
                        }

                        const game = activeGames.getGame(room);
                        game.state = 'Ingame'

                        const date = new Date();

                        Game.updateOne({ _id: room }, { $set: { 'state' : "Ingame", 'createdAt' : date }}).then(() => {
                        }).catch(error => {
                            console.log(error);
                        });

                        io.in(room).emit('gameStarted');

                        callback('Start');
                    }    

                    } catch (e) {
                        console.log(e);
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
                        
                        if(activeGames.getGame(room))
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
                     
            socket.on('playerJoinGame', async ({ id }, callback) => { 
                try{
                    const _id = (id).toString()
                    let user = await User.findById({ _id }).populate({ path: 'group', populate: { path: 'game' , populate: { path: 'route' }}});
                    if(user)
                    {
                        if(user.group)
                        {
                            if(user.group.game.state === 'Ingame')
                            {
                                // Join the game room
                                const gameRoom = (user.group.game._id).toString();
                                socket.join(gameRoom)

                                // Join the group room
                                const groupRoom = (user.group._id).toString();
                                socket.join(groupRoom)
                                
                                const endTime = user.group.game.createdAt;
                                endTime.setMinutes(endTime.getMinutes() + user.group.game.gameTime.minutes);
                                endTime.setHours(endTime.getHours() + user.group.game.gameTime.hours);

                                const data = {
                                    groupName : user.group.groupName,
                                    clue : user.group.game.route.challenges[user.group.currentChallenge - 1].clue,
                                    currentChallenge : user.group.currentChallenge,
                                    challenges : user.group.game.route.challengesAmount,
                                    endTime
                                }

                                socket.emit('gameData', { data });
                            } else callback('Game not active');

                        } else callback('Cannot play without group');

                    } else callback('User not found');       

                } catch (e) {
                    console.log(e);
                    callback('Error');
                }
                
            });
             
            socket.on('disconnect', () => {
                console.log(`Disconnected: ${socket.id}`);

                // Admin 
                const games = activeGames.getGames(socket.id);
                if(games.length > 0)
                {
                    for(const game of games) {
                        if(game.state === 'Pregame')
                        {
                            socket.to(game.room).emit('joinAgain');
                            activeGames.removeGame(game.room);
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


        Event.on('scan', async (groupToUpdate) => {
           try{
            const _id = (groupToUpdate).toString()
            let group = await Group.findById({ _id }).populate({ path: 'game', populate: { path: 'route'}});
            if(group)
            {
                if(group.game.state === 'Ingame')
                {
                    const groupRoom = (group._id).toString();

                    const endTime = group.game.createdAt;
                    endTime.setMinutes(endTime.getMinutes() + group.game.gameTime.minutes);
                    endTime.setHours(endTime.getHours() + group.game.gameTime.hours);

                    const data = {
                        groupName : group.groupName,
                        clue : group.game.route.challenges[group.currentChallenge].clue,
                        currentChallenge : group.currentChallenge+1,
                        challenges : group.game.route.challengesAmount,
                        endTime
                    }
                
                    // Notifying game data of the group
                    g_io.in(groupRoom).emit('gameData', { data });
                } else callback('Game not active');

            } else callback('Group not found');       

        } catch (e) {
            console.log(e);
            callback('Error');
        }


        });
    
    }
}