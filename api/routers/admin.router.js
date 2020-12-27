const { Router } = require ('express');
const { adminController } = require ('../controllers/admin.ctrl');
const adminRouter = new Router();

adminRouter.get('/routes', adminController.getAllRoutes);
adminRouter.get('/routes/:id', adminController.getRoute);
adminRouter.post('/routes', adminController.createRoute);
adminRouter.put('/routes/:id', adminController.updateRoute);
adminRouter.delete('/routes/:id', adminController.deleteRoute);

module.exports = adminRouter;