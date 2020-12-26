const { Router } = require ('express');
const { ensureAuth, ensureGuest } = require('../middlewares/auth')
const { adminController } = require ('../controllers/admin.ctrl');
const adminRouter = new Router();

adminRouter.get('/', ensureAuth, (req, res) => { adminController.adminDashboard(req,res); });

adminRouter.get('/routes', ensureAuth, (req, res) => { adminController.getRoutes(req, res); });
adminRouter.get('/routes/:id', ensureAuth, (req, res) => { adminController.getRoute(req, res); });
adminRouter.post('/routes', ensureAuth, (req, res) => { adminController.createRoute(req, res); });
adminRouter.put('/routes/:id', ensureAuth, (req, res) => { adminController.updateRoute(req, res); });
adminRouter.delete('/routes/:id', ensureAuth, (req, res) => { adminController.deleteRoute(req, res); });

module.exports = adminRouter;