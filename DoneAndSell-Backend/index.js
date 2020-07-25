const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys");
const multer = require("multer");
const upload = multer();

//Models
require("./models/User");
require("./models/Listing");
require("./models/Message");

//Defining routes
const authRoutes = require("./routes/AuthRoutes");
const listingRoutes = require("./routes/ListingRoutes");
const notificationsRoutes = require("./routes/NotificationsRoutes");
const messagesRoutes = require("./routes/MessagesRoutes");

//Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Parsing Formdata
app.use(upload.fields([]));

//Routes
app.use(authRoutes);
app.use(listingRoutes);
app.use(notificationsRoutes);
app.use(messagesRoutes);

//Connecting to MongoDB
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (error) => {
  console.log("Error connecting to MongoDB", error.message);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
