const { Router } = require ('express');
const { gameController } = require ('../controllers/game.ctrl');
const gameRouter = new Router();

gameRouter.get('/', gameController.getAllGames);
gameRouter.get('/:id', gameController.getGame);
gameRouter.post('/', gameController.createGame);
gameRouter.put('/:id', gameController.updateGame);
gameRouter.delete('/:id', gameController.deleteGame);

module.exports = gameRouter;