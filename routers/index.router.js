const path = require('path');
const { Router } = require ('express');
const { ensureAuth, ensureGuest } = require('../middlewares/auth')
const indexRouter = new Router();

indexRouter.get('/', ensureGuest, (req, res) => {
   res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

indexRouter.get('/admin', ensureAuth, (req, res) => {
   if (req.user.role === "admin")
      res.sendFile(path.join(__dirname, '../views', 'admin.html'));
   else res.send(404);
});

indexRouter.get('/join', ensureAuth, (req, res) => {
   if (req.user.role === "user")
      res.sendFile(path.join(__dirname, '../views', 'join.html'));
   else res.send(404);
});

module.exports = indexRouter;