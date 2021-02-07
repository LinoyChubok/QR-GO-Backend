const socket = require('socket.io');
const Game = require('../models/game.model');

const users = [];

const addUser = ({ id, user, room }) => {
  if(!room) return { error: 'Room are required.' };

  const name = user.name;
  const googleId = user.googleId;
  const image = user.image;

  const existingUser = users.find((user) => user.room === room && user.googleId === googleId);
  if(existingUser) return { error: 'You are already on the room!' };

  const newUser = { id, googleId, name, image, room };

  users.push(newUser);

  console.log(newUser);

  return { newUser };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

exports.socketController = {
    setServer(server){
        const io = socket(server, { cors: { origin: '*' } });

        // Run when client connect
        io.on('connection', socket => {

            console.log(`Connected: ${socket.id}`);

            socket.on('playerJoinGame', async ({ user, gamePin }, callback) => {
            try
            {
                if(isNaN(gamePin))
                    callback('Invalid Game PIN');
                else {
                // Find the game ID by the provided game pin
                let games = await Game.find({ 'gamePin': gamePin });

                // If the game exists
                if(games.length > 0){
        
                    if(games[0].state == 'Pregame')
                    {
                        const room = (games[0]._id).toString();
                
                        const { error, newUser } = addUser({ id: socket.id, user, room });

                        if(error) return callback(error);

                        console.log(newUser);

                        socket.emit('message', { text: `${newUser.name}, welcome to room ${newUser.room}.`});
                
                        // Join the game room
                        socket.join(newUser.room)

                        // Notifying that the player has joined the room.
                        socket.to(newUser.room).emit('message',  { text: `${newUser.name}, joined to room ${newUser.room}.`});
                        io.in(newUser.room).emit('roomData', { room: newUser.room, users: getUsersInRoom(newUser.room) });

                        callback();
                    } else {
                        callback('Game already started!')
                    }
            
                } else callback('Game not available!');        
            }

            } catch (e) {
                console.log(e);
                callback('Error');
            }

            });

            socket.on('disconnect', () => {
                console.log(`Disconnected: ${socket.id}`);
                const user = removeUser(socket.id);

                if(user) {
                  io.to(user.room).emit('message', { text: `${user.name} has left.` });
                  io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
                }
            })
        })
    }
}