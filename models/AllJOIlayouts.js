const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (JOI) => ({
  type: "string",
  base: JOI.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const JOI = BaseJoi.extend(extension);

const campgroundlayoutJOI = JOI.object({
  title: JOI.string().required().escapeHTML(),
  price: JOI.number().required().min(0).precision(2),
  location: JOI.string().required().escapeHTML(),
  description: JOI.string().required().escapeHTML(),
  // image: JOI.string().required(),
}).required();

module.exports.campgroundlayoutJOI = campgroundlayoutJOI;

const reviewLayoutJOI = JOI.object({
  rating: JOI.number().required().min(0).max(5),
  comment: JOI.string().required().escapeHTML(),
}).required();

module.exports.reviewLayoutJOI = reviewLayoutJOI;
