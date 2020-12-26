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
app.use('/admin', AdminOnly, require('./api/routers/admin.router'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken!');
});

app.listen(port, () => console.log('Express server is running on port ', port));