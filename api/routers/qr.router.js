const { Router } = require ('express');
const { qrController } = require ('../controllers/qr.ctrl');
const qrRouter = new Router();

qrRouter.post('/qr', qrController.createRoute);
qrRouter.get('/qr/:secret-key', qrController.getRoute);

module.exports = qrRouter;