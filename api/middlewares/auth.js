const site_url = "https://qr-go.netlify.app";

  module.exports = {
    GuestOnly: (req, res, next) => {
      if (req.isAuthenticated()) {
        if (req.user.role === "admin")
          res.redirect(`${site_url}/games`);
        else if (req.user.role === "player")
          res.redirect(`${site_url}/join`);
      } else {
        return next();
      }
    },
    AuthOnly: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect(site_url);
      }
    },
    PlayerOnly: (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === "player") {
          return next();
      } else {
        res.redirect(site_url);
      }
    },
    AdminOnly: (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === "admin") {
          return next();
      } else {
        res.redirect(site_url);
      }
    },
  };