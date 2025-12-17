const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewLayout = Schema({
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("review", reviewLayout);
