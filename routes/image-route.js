const express = require("express");
const router = express.Router();
const {
  uploadImage,
  fetchImages,
  deleteImage,
} = require("../controllers/image-controller");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");

//to upload an image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImage
);

//to get all the images
router.get("/getImage", fetchImages);

//to delete an image
router.delete("/:id", authMiddleware, adminMiddleware, deleteImage);

module.exports = router;
