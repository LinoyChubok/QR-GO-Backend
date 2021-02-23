const { Router } = require ('express');
const passport = require('passport')
const authRouter = new Router();

const site_url = "https://qr-go.netlify.app";
// const site_url = "http://localhost:3001";

authRouter.get('/google', passport.authenticate('google', { scope: ['profile'] }));
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: site_url }), (req, res) => { 
  if (req.isAuthenticated()) {
      res.redirect(`${site_url}/?user=${req.user._id}`);
  }
});

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect(site_url);
});

module.exports = authRouter;