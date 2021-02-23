const { Router } = require ('express');
const { statisticsController } = require ('../controllers/statistics.ctrl');
const statisticsRouter = new Router();

statisticsRouter.get('/:id', statisticsController.getStatistics);

module.exports = qrRouter;