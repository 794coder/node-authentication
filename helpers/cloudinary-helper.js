const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath) => {
  try {
    //get the result and return the secure url and publicId
    const result = await cloudinary.uploader.upload(filePath);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (e) {
    console.error(e);
    throw new Error("Something went wrong");
  }
};

module.exports = { uploadToCloudinary };
