const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  listingId: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  toEmail: {
    type: String,
    required: true,
  },
  toPushNotificationToken: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  fromEmail: {
    type: String,
    required: true,
  },
  fromPushNotificationToken: {
    type: String,
    required: true,
  },
  fromImageUrl: {
    type: String,
    required: true,
  },
});

mongoose.model("Message", messageSchema);
