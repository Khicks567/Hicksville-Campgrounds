const campground = require("../models/campground");
const AppError = require("../Errorhandle/appError");
const { cloudinary } = require("../cloudimages/index");
const mbxgeocode = require("@mapbox/mapbox-sdk/services/geocoding");
const MapboxToken = process.env.MapToken;

const Geocode = mbxgeocode({ accessToken: MapboxToken });

module.exports.Homepage = async (req, res, next) => {
  const campgrounds = await campground.find({});
  if (!campgrounds) {
    throw new AppError("no campgrounds", 404);
  }
  res.render("home", { campgrounds });
};

module.exports.Showcampgrounds = async (req, res, next) => {
  const { id } = req.params;

  const camp = await campground
    .findById(id)
    .populate({ path: "review", populate: { path: "user" } })
    .populate("author");
  if (!camp) {
    req.flash("error", "Campground not found");
    return res.redirect("/");
  }

  res.render("show", { camp });
};

module.exports.Updatecampgrounds = async (req, res, next) => {
  const { id } = req.params;

  const updatecamp = req.body;

  await campground.findByIdAndUpdate(id, updatecamp);
  req.flash("success", "Campground has been updated");
  res.redirect(`/camp/${id}`);
};

module.exports.Deletecampgrounds = async (req, res, next) => {
  const { id } = req.params;

  await campground.findByIdAndDelete(id);
  req.flash("success", "Campground has been deleted");
  res.redirect("/");
};

module.exports.AddcampgroundForm = (req, res) => {
  res.render("addcampground");
};

module.exports.AddCampgroundtosite = async (req, res, next) => {
  const newcamp = new campground(req.body);

  const geometry = await Geocode.forwardGeocode({
    query: req.body.location,
    limit: 1,
  }).send();
  if (geometry.body.features.length === 0) {
    req.flash(
      "error",
      "The specified location could not be found by the map service."
    );
    return res.redirect("/addcampground");
  }
  newcamp.geometry = geometry.body.features[0].geometry;
  newcamp.image = req.files.map((image) => ({
    url: image.path,
    filename: image.filename,
  }));

  newcamp.author = req.user._id;
  await newcamp.save();
  req.flash("success", "Campground has been added");
  res.redirect(`/camp/${newcamp._id}`);
};

module.exports.EditCampgroundForm = async (req, res, next) => {
  const { id } = req.params;

  const camp = await campground.findById(id);
  if (!camp) {
    req.flash("error", "Campground not found");
    return res.redirect("/");
  }

  res.render("editcampground", { camp });
};

module.exports.Addphotosform = async (req, res) => {
  const { id } = req.params;
  const camp = await campground.findById(id);
  if (!camp) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/camp");
  }

  res.render("addphotos", { camp });
};
module.exports.Addphotos = async (req, res, next) => {
  const { id } = req.params;

  const camp = await campground.findById(id);
  const images = req.files.map((image) => ({
    url: image.path,
    filename: image.filename,
  }));
  camp.image.push(...images);
  if (req.body.deleteImg) {
    for (let filename of req.body.deleteImg) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { image: { filename: { $in: req.body.deleteImg } } },
    });
  }
  await camp.save();

  req.flash("success", "Images have been Edited");
  res.redirect(`/camp/${id}`);
};
