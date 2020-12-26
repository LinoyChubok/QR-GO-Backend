
  module.exports = {
    //This validation for preventing the unauthenticated users to be on the next routes
    //Note: The validation of each role will be inside the next routes
    ensureAuth: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect("/");
      }
    },
    //This validation for preventing the authenticated users to be on the main page
    ensureGuest: (req, res, next) => {
      if (req.isAuthenticated()) {
        if (req.user.role === "admin")
          res.redirect("/admin");
        else if (req.user.role === "user")
          res.redirect("/join");
      } else {
        return next();
      }
    }
  };