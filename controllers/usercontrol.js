const User = require("../models/usermodel");

module.exports.Siginuppage = async (req, res, next) => {
  res.render("signup");
};

module.exports.CreateUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const madeUser = await User.register(user, password);
    req.login(madeUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User Created, Welcome to the Family");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.LoginPage = async (req, res, next) => {
  res.render("login");
};

module.exports.LoginUsers = (req, res, next) => {
  req.flash("success", "Logged in Sucessful");

  const redirectpath = res.locals.return || "/";
  delete req.session.return;
  res.redirect(redirectpath);
};

module.exports.Logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!, logged out Successful ");
    res.redirect("/");
  });
};
