const mongoose = require("mongoose");

mongoose
  .connect(process.env.MongoLink)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
