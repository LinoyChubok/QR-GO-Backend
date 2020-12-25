const path = require('path');
const express = require('express');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');

// Passport config
require('./config/passport')(passport)

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
    })
  )

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routers/index.router'));
app.use('/auth', require('./routers/auth.router'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken!');
});


app.listen(port, () => console.log('Express server is running on port ', port));