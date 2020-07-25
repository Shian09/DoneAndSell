const { Expo } = require("expo-server-sdk");

const sendPushNotification = async (targetPushToken, message, name) => {
  let expo = new Expo();

  if (!Expo.isExpoPushToken(targetPushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
  }

  let chunks = expo.chunkPushNotifications([
    {
      to: targetPushToken,
      sound: "default",
      title: `  ${name} says:`,
      body: message,
      channelId: "notification-sound-channel",
      data: {
        _displayInForeground: true,
      },
    },
  ]);

  let tickets = [];

  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();

  let receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log("Receipts: ", receipts);

        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === "ok") {
            console.log("It is okay");
            continue;
          } else if (status === "error") {
            console.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && details.error) {
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

module.exports = sendPushNotification;
