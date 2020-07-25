const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../keys");
const authRouter = express.Router();
const User = mongoose.model("User");
require("dotenv").config();

/******************Register a user*************************/
authRouter.post("/register", async (req, res) => {
  try {
    const { email, name: username, password, imageUrl } = req.body;
    const user = new User({ email, password, username, imageUrl });

    const result = await user.save();

    const token = jwt.sign(
      {
        userId: result._id,
        email: result.email,
        name: result.username,
        imageUrl: result.imageUrl,
        pushNotificationToken: result.pushNotificationToken,
      },
      jwtKey
    );

    return res.status(201).json(token);
  } catch (err) {
    let error;
    if (err.message.includes("E11000 duplicate key error collection")) {
      error = "A user with this given email already exists";
    }
    return res.status(500).json({ error });
  }
});

/*****************Logging in a user*************************/
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Must provide credentials" });

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Must provide correct credentials" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.username,
        imageUrl: user.imageUrl,
        pushNotificationToken: user.pushNotificationToken,
      },
      jwtKey
    );
    return res.status(200).json(token);
  } catch (err) {
    return res.status(500).json({ error: "Please provide correct password" });
  }
});

module.exports = authRouter;
