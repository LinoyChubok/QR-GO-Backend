const path = require('path');
const { Router } = require ('express');
const { ensureAuth, ensureGuest } = require('../middlewares/auth')
const indexRouter = new Router();

indexRouter.get('/', ensureGuest, (req, res) => {
   res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

indexRouter.get('/admin', ensureAuth, (req, res) => {
   res.sendFile(path.join(__dirname, '../client', 'admin.html'));
});

module.exports =  indexRouter ;