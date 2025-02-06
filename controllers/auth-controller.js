const User = require("../models/User");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//register controller

const registerUser = async (req, res) => {
  try {
    //destructure the request body
    const { username, email, password, role } = req.body;
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      res.json({
        success: false,
        message:
          "User already exists.Please try with a different username or email",
      });
    }
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newlyCreatedUser.save();
    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newlyCreatedUser,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to create the user",
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again!",
    });
  }
};

//login controller
const userLogin = async (req, res) => {
  try {
    //get the username and password
    const { username, password } = req.body;
    //check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User dosen't exist",
      });
    }
    //check if the password matches
    const checkPassword = await bycrypt.compare(password, user.password);
    if (!checkPassword) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials!",
      });
    }
    //create a bearer token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again!",
    });
  }
};

//change password controller
const changePassword = async (req, res) => {
  try {
    //get the current user id ie that user making the request
    const getUserId = req.userInfo.userId;

    //get the old and new password
    const { oldPassword, newPassword } = req.body;

    //get the current user from database
    const user = await User.findById(getUserId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    //check if the old password is correct
    const passwordMatch = await bycrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password does not match",
      });
    }
    //hash the new password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(newPassword, salt);

    //update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again!",
    });
  }
};

module.exports = { registerUser, userLogin, changePassword };
