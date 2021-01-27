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
                message: 'Error while fetching the routes data'
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
                message: 'Error while fetching the route data'
            })
        });
    },
    createRoute(req, res) {
        const { routeName, district, description, image, challengesAmount, challenges } = req.body;

        if(challengesAmount > 0)
        {
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
                    message: 'Error please fill all the fields correctly'
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
            const challengesAmount = req.body.challengesAmount;
            if(challengesAmount > 0)
            {
                const challenges = req.body.challenges;

                for(let i = 0 ; i < challengesAmount; i++)
                {
                    if(!challenges[i].clue)
                    res.status(500).json({
                        status: false,
                        message: 'Please fill in the clue for any challenge'
                    });
                }

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
                        message: 'Error while updating the route data'
                    })
                });
            }
            else res.status(500).json({
                status: false,
                message: 'Please add at least one challenge'
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
                message:'Error while deleting the route'
            })
        });
    }
}