const Route = require('../models/route.model');

exports.routeController = {
    getAllRoutes(req, res) {
        let filter = { };
        if('district' in req.query)
            filter.district = req.query.district;
        Route.find(filter).then((routes) => {
            res.status(200).json({
                routes
            });
        }).catch(error => {
            res.status(500).json({
                status: false,
                message: 'Error'
            })
        });
    },
    getRoute(req, res) {
        const routeId = req.params.id;

        Route.findById(routeId).then((route) => {
            res.status(200).json({
                route
            })
        }).catch(error => {
            res.status(500).json({
                status: false,
                message: 'Error'
            })
        });
    },
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

        if(challengesAmount > 0)
        {
            newRoute.save().then(() => {
                res.status(200).json({
                    status: true,
                    message: 'Route has been added successfuly'
                });
            }).catch(error => {
                res.status(500).json({
                    status: false,
                    message: 'Error'
                });
            });
        }
        else res.status(500).json({
            status: false,
            message: 'Please add at least one challenge'
        });
    },
    updateRoute(req, res) {
        const routeId = req.params.id;

        Route.findById(routeId).then((route) => {
            if (!route) {
                return res.status(404).json({
                    status: false,
                    message: 'Route not found'
                })
            }
        }).then(() => {
            Route.updateOne({_id: routeId}, {
                $set: {...req.body}
            }).then(() => {
                res.status(200).json({
                    status: true,
                    message: `Route _id: ${routeId} has been updated successfuly`
                })
            }).catch(error => {
                res.status(500).json({
                    status: false,
                    message: 'Error'
                })
            });
        })
    },
    deleteRoute(req, res) { 
        const routeId = req.params.id;

        Route.findOneAndDelete( { _id: routeId }).then((route) => {
            res.status(200).json({
                status: true,
                message: `Route _id: ${routeId} has been deleted successfuly`
            })
        }).catch(error => {
            res.status(500).json({
                status: false,
                message:'Error'
            })
        });
    }
}