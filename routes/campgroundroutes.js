const express = require("express");
const router = express.Router();
const wrapError = require("../Errorhandle/handleerrorwrap");
const isloggedIn = require("../middleware/isloggedin");
const validateCampground = require("../middleware/validateCampground");
const checkAuthor = require("../middleware/checkauthor");
const multer = require("multer");
const { storage } = require("../cloudimages/index");
const upload = multer({ storage });

const {
  Homepage,
  Showcampgrounds,
  Updatecampgrounds,
  Deletecampgrounds,
  AddcampgroundForm,
  AddCampgroundtosite,
  EditCampgroundForm,
  Addphotos,
  Addphotosform,
} = require("../controllers/campgroundcontrol");

router.route("/").get(wrapError(Homepage));

router
  .route("/camp/:id")
  .get(wrapError(Showcampgrounds))
  .put(
    isloggedIn,
    checkAuthor,
    validateCampground,
    wrapError(Updatecampgrounds)
  )
  .delete(isloggedIn, checkAuthor, wrapError(Deletecampgrounds));

router
  .route("/addcampground")
  .get(isloggedIn, AddcampgroundForm)
  .post(
    isloggedIn,
    upload.array("image"),
    validateCampground,
    wrapError(AddCampgroundtosite)
  );

router
  .route("/camp/:id/editcampground")
  .get(isloggedIn, checkAuthor, wrapError(EditCampgroundForm));

router
  .route("/camp/:id/editcampground/photos")
  .get(isloggedIn, checkAuthor, wrapError(Addphotosform))
  .put(isloggedIn, checkAuthor, upload.array("image"), wrapError(Addphotos));

module.exports = router;
