import cron from "node-cron";

import Monitor from "../model/Monitor.js";
import { checkAvailability } from "./railkit.service.js";
import { sendPushNotification } from "./notification.service.js";

const CHECK_INTERVAL = "*/5 * * * *"; // Every 5 minutes
// const CHECK_INTERVAL = "* * * * *"; // Every minute (for testing)

export const startCronJob = () => {
  cron.schedule(CHECK_INTERVAL, async () => {
    console.log("Running monitor job...", new Date().toLocaleString());

    try {
      const monitors = await Monitor.find({
        active: true,
        notified: false,
      });

      console.log(`Found ${monitors.length} active monitor(s)`);

      for (const monitor of monitors) {
        try {
          const data = await checkAvailability({
            train: monitor.train,
            from: monitor.from,
            to: monitor.to,
            date: monitor.date,
            coachClass: monitor.coachClass,
            quota: monitor.quota,
          });

          monitor.lastCheckedAt = new Date();

          const availableSeat = data.availability.find((item) =>
            item.availabilityText.startsWith("CURR-AVL")
          );

          if (!availableSeat) {
            await monitor.save();
            continue;
          }

          console.log(
            `Seat available for train ${monitor.train}: ${availableSeat.availabilityText}`
          );

          await sendPushNotification(
            monitor.expoPushToken,
            "Seat Available 🎉",
            `${monitor.train} - ${availableSeat.availabilityText}`,
            {
              train: monitor.train,
              availability: availableSeat.availabilityText,
            }
          );

          monitor.active = false;
          monitor.notified = true;

          await monitor.save();

          console.log(
            `Notification sent. Monitoring stopped for ${monitor.train}`
          );
        } catch (err) {
          console.error(
            `Error checking train ${monitor.train}:`,
            err.message
          );
        }
      }
    } catch (err) {
      console.error("Cron Job Error:", err.message);
    }
  });

  console.log("RailKit monitor cron started.");
};