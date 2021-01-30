const { Router } = require ('express');
const { userController } = require ('../controllers/user.ctrl');
const userRouter = new Router();

userRouter.get('/:id', userController.getUser);

module.exports = userRouter;