const http = require('http');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const { userController } = require('./api/controllers/user.ctrl');
const { socketController } = require('./api/controllers/socket.ctrl');
const { GuestOnly, AuthOnly, PlayerOnly, AdminOnly } = require('./api/middlewares/auth');
const { Cookie } = require('express-session');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

userController.passport(passport);
socketController.setServer(server);

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
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
      cookie: { maxAge: 1000 * 60 * 60 * 24 }
    })
  )

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => { res.send("QR GO REST API"); });
app.use('/auth', require('./api/routers/auth.router'));
app.use('/api/users', require('./api/routers/user.router')); 
app.use('/api/games', require('./api/routers/game.router')); 
app.use('/api/routes', require('./api/routers/route.router')); 
app.use('/api/qr', require('./api/routers/qr.router')); 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken!');
});

server.listen(port, () => console.log(`Express server is running on port ${port}`));