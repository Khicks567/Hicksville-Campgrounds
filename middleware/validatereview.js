// Joi exports
const { reviewLayoutJOI } = require("../models/AllJOIlayouts");

const validatereview = (req, res, next) => {
  const { error } = reviewLayoutJOI.validate(req.body);

  if (error) {
    const msg = error.details.map((word) => word.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports = validatereview;
