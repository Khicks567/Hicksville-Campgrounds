const campreview = require("../models/reviewmodel");

const isreviewuser = async (req, res, next) => {
  const { idreview, idcamp } = req.params;
  const reviewmade = await campreview.findById(idreview);
  if (!reviewmade.user.equals(req.user._id)) {
    req.flash("error", "Dont have Permission to edit");
    return res.redirect(`/camp/${idcamp}`);
  }
  next();
};

module.exports = isreviewuser;
