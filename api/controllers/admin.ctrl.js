const path = require('path');
const Route = require('../models/route.model');

exports.adminController = {
    adminDashboard(req, res) {
        if (req.user.role === "admin")
            res.sendFile(path.join(__dirname, '../../views', 'admin.html'));
        else res.send(404);
    },
    getAllRoutes(req, res) {},
    getRoute(req, res) {},
    createRoute(req, res) {
        const { routeName, district, description, image, challengesAmount, challenges } = req.body;

        const newRoute = new Route({
            routeName,
            district,
            description,
            image,
            challengesAmount,
            challenges
        });

        newRoute.save().then(() => {
            res.status(200).json({
                status: true,
                message: 'Route has been added successfuly'
            });
        }).catch(error => {
            res.status(500).json({
                status: false,
                message: error
            })
        });
    },
    updateRoute(req, res) {},
    deleteRoute(req, res) {}
}