const { Router } = require ('express');
const { adminController } = require ('../controllers/admin.ctrl');
const adminRouter = new Router();

adminRouter.get('/', adminController.adminDashboard);

adminRouter.get('/api/routes', adminController.getAllRoutes);
adminRouter.get('/api/routes/:id', adminController.getRoute);
adminRouter.post('/api/routes', adminController.createRoute);
adminRouter.put('/api/routes/:id', adminController.updateRoute);
adminRouter.delete('/api/routes/:id', adminController.deleteRoute);

module.exports = adminRouter;