const campground = require("../models/campground");
const campreview = require("../models/reviewmodel");

module.exports.Makeareview = async (req, res, next) => {
  const { id } = req.params;
  const camp = await campground.findById(id);

  const newreview = new campreview(req.body);
  newreview.user = req.user._id;
  camp.review.push(newreview);

  await newreview.save();
  await camp.save();
  req.flash("success", "Review has been added");
  res.redirect(`/camp/${id}`);
};

module.exports.DeleteReview = async (req, res, next) => {
  const { idreview, idcamp } = req.params;
  await campground.findByIdAndUpdate(idcamp, { $pull: { review: idreview } });
  await campreview.findByIdAndDelete(idreview);
  req.flash("success", "Review has been deleted");
  res.redirect(`/camp/${idcamp}`);
};
