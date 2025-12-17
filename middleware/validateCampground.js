// Joi exports
const { campgroundlayoutJOI } = require("../models/AllJOIlayouts");

const validateCampground = (req, res, next) => {
  const { error } = campgroundlayoutJOI.validate(req.body);

  if (error) {
    const msg = error.details.map((word) => word.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports = validateCampground;
