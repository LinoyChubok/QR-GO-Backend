const { Router } = require ('express');
const { qrController } = require ('../controllers/qr.ctrl');
const qrRouter = new Router();

qrRouter.post('/', qrController.createQR);
qrRouter.get('/:secretkey', qrController.getQR);

module.exports = qrRouter;