const express = require("express");
const notificationRouter = express.Router();
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const User = mongoose.model("User");

notificationRouter.post("/:email/pushTokens", requireAuth, async (req, res) => {
  const { email } = req.params;
  const { token } = req.body;
  let updatedUser = null;
  try {
    await User.update(
      { email: email },
      { $set: { pushNotificationToken: token } }
    );

    const result = await User.findOne({ email: email });

    updatedUser = {
      userId: result._id,
      email: result.email,
      name: result.username,
      imageUrl: result.imageUrl,
      pushNotificationToken: result.pushNotificationToken,
    };

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(304).json({ error: "Could not update field. ", err });
  }
});

module.exports = notificationRouter;
