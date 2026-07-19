import { getAvailability } from "railkit";
import { sendNotification } from "./notification.js";

export const checkTrainAvailability = async (monitor) => {
  try {
    const result = await getAvailability(
      monitor.train,
      monitor.from,
      monitor.to,
      monitor.date,
      monitor.coachClass,
      monitor.quota,
    );

    const first = result.availability?.[0];

    if (!first) return;

    if (first.availabilityText.startsWith("CURR_AVL")) {
      await sendNotification(
        monitor.expoPushToken,
        monitor.train,
        first.availabilityText,
      );

      monitor.notified = true;
      monitor.active = false; // Stop monitoring

      await monitor.save();
    }
  } catch (err) {
    console.error(`Error checking train ${monitor.train}:`, err.message);
  }
};
