const express = require("express");
const {
  registerUser,
  userLogin,
  changePassword,
} = require("../controllers/auth-controller");
const userRoutes = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
//all routes are related to authentication and authorizaion

userRoutes.post("/register", registerUser);
userRoutes.post("/login", userLogin);
userRoutes.post("/change", authMiddleware, changePassword);
module.exports = userRoutes;
