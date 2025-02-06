const mongoose = require("mongoose");
// require("dotenv").config();

const connectToDb = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

module.exports = connectToDb;
