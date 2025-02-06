require("dotenv").config();
const express = require("express");
const app = express();
const connectToDb = require("./database/db");
const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-route");
const adminRoutes = require("./routes/admin-route");
const imageRoutes = require("./routes/image-route");

//use the middleware to parse json
app.use(express.json());

//create database connection
connectToDb();

//create the main router
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRoutes);

//create the port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is now running at PORT ${PORT}`);
});
