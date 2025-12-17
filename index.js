if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const sanitizeV5 = require("./santize");

const express = require("express");
const app = express();
app.set("query parser", "extended");
const path = require("path");
require("./database");
const engineEjs = require("ejs-mate");
const methodOverride = require("method-override");
const AppError = require("./Errorhandle/appError");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const campgroundroutes = require("./routes/campgroundroutes");
const campreviewroutes = require("./routes/campreviewsroutes");
const userroutes = require("./routes/userroutes");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/usermodel");

// middleware
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", engineEjs);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(sanitizeV5({ replaceWith: "_" }));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const store = MongoStore.create({
  mongoUrl: process.env.MongoLink,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.StoreSession,
  },
});

store.on("error", function (e) {
  console.log("Session store error");
});

const sessionconfig = {
  store,
  name: "HicksvilleCampgrounds",
  secret: process.env.Sessionsecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxage: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionconfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentuser = req.user;
  res.locals.message = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

// routes

app.use("/", campgroundroutes);
app.use("/", campreviewroutes);
app.use("/", userroutes);

// error middleware

app.all(/(.*)/, (req, res, next) => {
  next(new AppError("page not found", 404));
});

app.use((error, req, res, next) => {
  const { status = 500 } = error;

  if (!error.message) {
    error.message = "Not Found";
  }

  res.status(status).render("errorTemp", { error });
});

// sever listen
app.listen(3000, () => {
  console.log("it works");
});
