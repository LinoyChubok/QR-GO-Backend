const { Router } = require ('express');
const { loginController } = require ('../controllers/login.ctrl');
const { ensureAuth, ensureGuest } = require('../middlewares/auth')
const loginRouter = new Router();

loginRouter.get('/', ensureAuth, loginController.login);

module.exports =  loginRouter ;