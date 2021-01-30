const { Router } = require ('express');
const passport = require('passport')
const authRouter = new Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile'] }));
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: 'https://qr-go.netlify.app' }), (req, res) => { 
  if (req.isAuthenticated()) {
      res.redirect(`http://localhost:3001/?user=${req.user._id}`);
  }
});

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('https://qr-go.netlify.app');
});

module.exports = authRouter;