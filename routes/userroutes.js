const express = require("express");
const router = express.Router();
const wrapError = require("../Errorhandle/handleerrorwrap");
const passport = require("passport");
const storeReturnTo = require("../middleware/storeReturnTo");

const {
  Siginuppage,
  CreateUser,
  LoginPage,
  LoginUsers,
  Logout,
} = require("../controllers/usercontrol");

router.route("/signup").get(wrapError(Siginuppage)).post(wrapError(CreateUser));

router
  .route("/login")
  .get(wrapError(LoginPage))
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    LoginUsers
  );

router.route("/logout").get(Logout);

module.exports = router;
