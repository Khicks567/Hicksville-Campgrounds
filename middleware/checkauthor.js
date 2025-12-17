const campground = require("../models/campground");

const checkAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campgroundold = await campground.findById(id);
  if (!campgroundold.author.equals(req.user._id)) {
    req.flash("error", "Dont have Permission to edit");
    return res.redirect(`/camp/${id}`);
  }
  next();
};

module.exports = checkAuthor;
