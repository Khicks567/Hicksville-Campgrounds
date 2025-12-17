const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CloudName,
  api_key: process.env.APIkey,
  api_secret: process.env.APISecret,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "CampgroundApp", allowedFormats: ["jpeg", "png", "jpg"] },
});

module.exports = { cloudinary, storage };
