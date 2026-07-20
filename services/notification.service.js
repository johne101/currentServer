import expo from "../config/expo.js";

export const sendPushNotification = async (
  expoPushToken,
  title,
  body,
  data = {}
) => {
  try {
    if (!Expo.isExpoPushToken(expoPushToken)) {
      console.log("Invalid Expo Push Token:", expoPushToken);
      return false;
    }

    const messages = [
      {
        to: expoPushToken,
        sound: "default",
        title,
        body,
        data,
      },
    ];

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      console.log("Expo Tickets:", tickets);
    }

    return true;
  } catch (error) {
    console.error("Push Notification Error:", error);
    return false;
  }
};