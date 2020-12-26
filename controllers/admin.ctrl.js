const path = require('path');

exports.adminController = {
    adminDashboard(req, res) {
        if (req.user.role === "admin")
            res.sendFile(path.join(__dirname, '../views', 'admin.html'));
        else res.send(404);
    },
    getRoutes(req, res) {},
    getRoute(req, res) {},
    createRoute(req, res) {},
    updateRoute(req, res) {},
    deleteRoute(req, res) {}
}