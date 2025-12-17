const express = require("express");
const app = express();
const path = require("path");
require("../database");
const campground = require("../models/campground");

const { descriptors, places } = require("./seedhelpers");

const city = require("./cities");
const { default: mongoose } = require("mongoose");

const seedDB = async () => {
  await campground.deleteMany({});

  for (let i = 0; i < 200; i++) {
    const randomcity = Math.floor(Math.random() * 1000);
    const randomdec = Math.floor(Math.random() * 18);
    const randomplace = Math.floor(Math.random() * 21);
    const randomprice = Math.floor(Math.random() * 100) + 1;

    const camp = new campground({
      title: `${descriptors[randomdec]} ${places[randomplace]}`,
      location: `${city[randomcity].city},${city[randomcity].state}`,
      image: [
        {
          url: `https://picsum.photos/400?random=${i}`,
          filename: "Test images",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [city[randomcity].longitude, city[randomcity].latitude],
      },
      description: `is ${descriptors[randomdec]} and ${places[randomplace]} i love it`,
      price: randomprice,
      author: "69336f8972381ec3ef03e2d0",
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
