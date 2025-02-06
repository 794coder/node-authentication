const Image = require("../models/Image");
const { uploadToCloudinary } = require("../helpers/cloudinary-helper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    //check if the file is missing
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File required.Upload an image",
      });
    }
    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //store the imageUrl and publicId along with user id in database
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });
    await newlyUploadedImage.save();
    //delete the file from local storage
    fs.unlinkSync(req.file.path);
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newlyUploadedImage,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again",
    });
  }
};

const fetchImages = async (req, res) => {
  try {
    //pagination
    //get the no of pages you want to display plus the limit of how many products you want to display
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    //sort by and sortOrder plus totalImages and totalPages
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    //set the sort obj
    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalImages: totalImages,
        totalPages: totalPages,
        data: images,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again",
    });
  }
};

//delete image controller
const deleteImage = async (req, res) => {
  try {
    //get the image and user id
    const getImageId = req.params.id;
    const user = req.userInfo.userId;
    // console.log(getImageId);
    // console.log(user);
    const image = await Image.findById(getImageId);
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image to be deleted not found.",
      });
    }
    // check if the image is uploaded by the user trying to delete it
    if (image.uploadedBy.toString() !== user) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete the image.",
      });
    }
    //delete the image from your cloudinary storage publicId is required
    await cloudinary.uploader.destroy(image.publicId);

    //delete the image from your database
    await Image.findByIdAndDelete(getImageId);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again",
    });
  }
};
module.exports = { uploadImage, fetchImages, deleteImage };
