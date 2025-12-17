const express = require("express");
const router = express.Router();
const wrapError = require("../Errorhandle/handleerrorwrap");
const isloggedin = require("../middleware/isloggedin");
const validatereview = require("../middleware/validatereview");
const isreviewuser = require("../middleware/isreviewuser");

const { Makeareview, DeleteReview } = require("../controllers/reviewcontrol");

router
  .route("/camp/review/:id")
  .post(isloggedin, validatereview, wrapError(Makeareview));

// delete reviews

router
  .route("/camp/:idcamp/review/:idreview")
  .delete(isloggedin, isreviewuser, wrapError(DeleteReview));

module.exports = router;
