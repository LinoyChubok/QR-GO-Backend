
  module.exports = {
    GuestOnly: (req, res, next) => {
      if (req.isAuthenticated()) {
        if (req.user.role === "admin")
          res.redirect("https://qr-go.netlify.app/games");
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
        res.redirect("https://qr-go.netlify.app");
      }
    },
    PlayerOnly: (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === "player") {
          return next();
      } else {
        res.redirect("https://qr-go.netlify.app");
      }
    },
    AdminOnly: (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === "admin") {
          return next();
      } else {
        res.redirect("https://qr-go.netlify.app");
      }
    },
  };