const isloggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.return = req.originalUrl;
    req.flash("error", "Must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports = isloggedIn;
