const { Router } = require ('express');
const passport = require('passport')
const authRouter = new Router();
const { GuestOnly, AuthOnly, PlayerOnly, AdminOnly } = require('../middlewares/auth');

authRouter.get('/google', passport.authenticate('google', { scope: ['profile'] }));
authRouter.get('/google/callback',passport.authenticate('google', { failureRedirect: '/' }), GuestOnly);

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://127.0.0.1:5500/index.html');
});

module.exports = authRouter;