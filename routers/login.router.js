const { Router } = require ('express');
const { loginController } = require ('../controllers/login.ctrl');
const loginRouter = new Router();

loginRouter.get('/', loginController.login);

module.exports = { loginRouter };