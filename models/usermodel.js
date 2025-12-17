const mongoose = require("mongoose");
const passport = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userLayout = new Schema({
  email: { type: String, unique: true, required: [true, "Need a email"] },
});

userLayout.plugin(passport);

module.exports = mongoose.model("user", userLayout);
