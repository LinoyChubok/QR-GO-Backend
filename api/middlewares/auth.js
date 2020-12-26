
  module.exports = {
    GuestOnly: (req, res, next) => {
      if (req.isAuthenticated()) {
        if (req.user.role === "admin")
          res.redirect("/admin");
        else if (req.user.role === "player")
          res.redirect("/join");
      } else {
        return next();
      }
    },
    AuthOnly: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect("/");
      }
    },
    PlayerOnly: (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === "player") {
          return next();
      } else {
        res.redirect("/");
      }
    },
    AdminOnly: (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === "admin") {
          return next();
      } else {
        res.redirect("/");
      }
    },
  };