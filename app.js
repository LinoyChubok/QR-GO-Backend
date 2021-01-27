const http = require('http');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
require('./api/controllers/user.ctrl')(passport);
const socket = require('socket.io');
const { GuestOnly, AuthOnly, PlayerOnly, AdminOnly } = require('./api/middlewares/auth');

const app = express();
const server = http.createServer(app); 
const port = process.env.PORT || 3000;
const io = socket(server, { cors: { origin: '*' } });

// Run when client connect
io.on('connection', socket => {
   console.log('New client connection'); 
   socket.on('disconnect', () => {
    console.log('client disconnect'); 
   })
  })

// Access Control
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS')
  res.set('Content-Type', 'application/json');
  next();
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
    session({
      secret: 'shenkar',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
  )

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', GuestOnly, (req, res) => { res.send("QR GO REST API"); });
app.use('/auth', require('./api/routers/auth.router'));
app.use('/api/games', require('./api/routers/game.router')); 
app.use('/api/routes', require('./api/routers/route.router')); 
app.use('/api/qr', require('./api/routers/qr.router')); 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken!');
});

server.listen(port, () => console.log(`Express server is running on port ${port}`));