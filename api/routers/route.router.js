const { Router } = require ('express');
const { routeController } = require ('../controllers/route.ctrl');
const routeRouter = new Router();

routeRouter.get('/', routeController.getAllRoutes);
routeRouter.get('/:id', routeController.getRoute);
routeRouter.post('/', routeController.createRoute);
routeRouter.put('/:id', routeController.updateRoute);
routeRouter.delete('/:id', routeController.deleteRoute);

module.exports = routeRouter;