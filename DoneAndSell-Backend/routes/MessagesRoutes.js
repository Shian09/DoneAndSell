const express = require("express");
const messagesRouter = express.Router();
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const sendPushNotification = require("../utility/pushNotifications");
const Message = mongoose.model("Message");

/******************Get messages***************************/
messagesRouter.get("/messages/:email", requireAuth, async (req, res) => {
  const { email } = req.params;
  let result = [];
  let messages = [];
  let message = null;
  try {
    result = await Message.find({ toEmail: email });

    if (result.length) {
      result.forEach((doc) => {
        message = {
          messageId: doc._id,
          message: doc.message,
          listingId: doc.listingId,
          to: doc.to,
          toEmail: doc.toEmail,
          toPushNotificationToken: doc.toPushNotificationToken,
          from: doc.from,
          fromEmail: doc.fromEmail,
          fromPushNotificationToken: doc.fromPushNotificationToken,
          fromImageUrl: doc.fromImageUrl,
        };
        messages = [...messages, message];
      });
      return res.status(200).json(messages);
    } else {
      return res.status(200).json(result);
    }
  } catch (err) {
    console.error("Error in retrieving message: ", err);
    return res.status(500).json({ error: "Message not retrieved.", err });
  }
});

/******************Post a Message*************************/
messagesRouter.post("/message", requireAuth, async (req, res) => {
  let messagePosted = null;
  let result = null;

  const {
    message,
    listingId,
    to,
    toEmail,
    toPushNotificationToken,
    from,
    fromEmail,
    fromPushNotificationToken,
    fromImageUrl,
  } = req.body;

  const messageToSave = new Message({
    message,
    listingId,
    to,
    toEmail,
    toPushNotificationToken,
    from,
    fromEmail,
    fromPushNotificationToken,
    fromImageUrl,
  });

  try {
    result = await messageToSave.save();

    messagePosted = {
      messageId: result._id,
      message: result.message,
      listingId: result.listingId,
      to: result.to,
      toEmail: result.toEmail,
      toPushNotificationToken: result.toPushNotificationToken,
      from: result.from,
      fromEmail: result.fromEmail,
      fromPushNotificationToken: result.fromPushNotificationToken,
      fromImageUrl: result.fromImageUrl,
    };

    //HERE SEND PUSH NOTIFICATION
    if (result) {
      await sendPushNotification(toPushNotificationToken, message, from);
    }

    return res.status(201).json(messagePosted);
  } catch (err) {
    console.error("Error in saving: ", err);
    return res
      .status(500)
      .json({ error: "Message not saved in database.", err });
  }
});

/***************************Delete a message**********************/
messagesRouter.delete("/message/:messageId", requireAuth, async (req, res) => {
  const { messageId } = req.params;

  try {
    await Message.findOneAndDelete({ _id: messageId });

    res.status(204).json({ success: "The message has been deleted" });
  } catch (error) {
    console.error("Error in deleting message: ", err);
    return res
      .status(500)
      .json({ error: "Message not deleted from database.", err });
  }
});
module.exports = messagesRouter;
