const path = require('path');
const { Router } = require ('express');
const { ensureAuth, ensureGuest } = require('../middlewares/auth')
const indexRouter = new Router();

indexRouter.get('/', ensureGuest,   (req, res) => {
   res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

indexRouter.get('/admin', ensureAuth, (req, res) => {
   res.sendFile(path.join(__dirname, '../views', 'admin.html'));
});

module.exports = indexRouter;