const path = require('path');
const express = require("express");
const logger = require("morgan");
const passport = require('passport');
const session = require('express-session');

// Passport config
require('./config/passport')(passport)

const app = express();
const port = process.env.PORT || 3000;

// Morgan logger
app.use(logger("dev"));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname + '/client/')));

// Sessions
app.use(
    session({
      secret: 'shenkar',
      resave: false,
      saveUninitialized: false,
    })
  )

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/', require("./routers/login.router"));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken!');
});


app.listen(port, () => console.log('Express server is running on port ', port));