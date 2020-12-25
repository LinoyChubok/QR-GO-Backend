const { Router } = require ('express');
const passport = require('passport')
const authRouter = new Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile'] }));

authRouter.get('/google/callback',passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  if (req.user.role === "admin")
    res.redirect("/admin"); 
  else if (req.user.role === "user")
    res.send("hello user");
});

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = authRouter;