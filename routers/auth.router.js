const { Router } = require ('express');
const passport = require('passport')
const authRouter = new Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile'] }))

authRouter.get( '/google/callback',passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/admin')
  }
)

module.exports = authRouter;