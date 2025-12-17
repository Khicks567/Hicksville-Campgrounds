const mongoose = require("mongoose");
const Review = require("./reviewmodel");
const Schema = mongoose.Schema;
const options = { toJSON: { virtuals: true } };
const imglayout = new Schema({
  url: String,
  filename: String,
});

imglayout.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campgroundLayout = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    geometry: {
      type: { type: String, enum: ["Point"], default: "Point", required: true },
      coordinates: { type: [Number], required: true },
    },
    description: { type: String, required: true },
    image: { type: [imglayout], required: true },
    review: [{ type: Schema.Types.ObjectId, ref: "review" }],
    author: { type: Schema.Types.ObjectId, ref: "user" },
  },
  options
);

campgroundLayout.post("findOneAndDelete", async function (camp) {
  if (camp.review.length !== 0) {
    await Review.deleteMany({ _id: { $in: camp.review } });
  }
});

campgroundLayout.virtual("properties.popuplayout").get(function () {
  return `<strong><a href="/camp/${this._id}"> ${this.title}</a></strong>`;
});

module.exports = mongoose.model("campground", campgroundLayout);
