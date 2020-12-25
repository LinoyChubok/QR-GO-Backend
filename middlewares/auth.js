module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      if (req.user.role === "admin")
        res.redirect("/admin"); 
      else if (req.user.role === "user")
        res.send("hello user");
    }
  }
};