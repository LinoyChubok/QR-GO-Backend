const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
require('./api/controllers/user.ctrl')(passport);
const { GuestOnly, AuthOnly, PlayerOnly, AdminOnly } = require('./api/middlewares/auth');

const app = express();
const port = process.env.PORT || 3000;

// Morgan logger
app.use(logger('dev'));

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

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', GuestOnly, (req, res) => { res.sendFile(path.join(__dirname, '/views', 'index.html')); });
app.use('/auth', require('./api/routers/auth.router'));
app.get('/admin', AdminOnly, (req, res) => { res.sendFile(path.join(__dirname, '/views', 'admin.html')); });

app.use('/api/routes', require('./api/routers/route.router')); //TODO: ADD ADMIN AUTH
app.use('/api/qr', require('./api/routers/qr.router')); //TODO: ADD AUTH

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken!');
});

app.listen(port, () => console.log('Express server is running on port ', port));