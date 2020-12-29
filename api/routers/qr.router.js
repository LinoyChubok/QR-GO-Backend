const { Router } = require ('express');
const { qrController } = require ('../controllers/qr.ctrl');
const qrRouter = new Router();

qrRouter.get('/:secretkey', qrController.scanQR);
qrRouter.post('/', qrController.createQR);

module.exports = qrRouter;