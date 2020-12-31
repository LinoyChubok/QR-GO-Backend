
  module.exports = {
    GuestOnly: (req, res, next) => {
      if (req.isAuthenticated()) {
        if (req.user.role === "admin")
          res.redirect("http://127.0.0.1:5500/routes.html");
        else if (req.user.role === "player")
          res.send("Please stay tuned")
      } else {
        return next();
      }
    },
    AuthOnly: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect("http://127.0.0.1:5500/index.html");
      }
    },
    PlayerOnly: (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === "player") {
          return next();
      } else {
        res.redirect("http://127.0.0.1:5500/index.html");
      }
    },
    AdminOnly: (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === "admin") {
          return next();
      } else {
        res.redirect("http://127.0.0.1:5500/index.html");
      }
    },
  };