import cron from "node-cron";

import Monitor from "../model/Monitor.js";
import { checkAvailability } from "./railkit.service.js";
import { sendPushNotification } from "./notification.service.js";

const CHECK_INTERVAL = "*/5 * * * *";
// const CHECK_INTERVAL = "* * * * *";

export const startCronJob = () => {
  cron.schedule(CHECK_INTERVAL, async () => {
    console.log("\n========================================");
    console.log("Running monitor job...");
    console.log("Time:", new Date().toLocaleString());
    console.log("========================================");

    try {
      const monitors = await Monitor.find({
        active: true,
        notified: false,
      });

      console.log(`Found ${monitors.length} active monitor(s)`);

      if (monitors.length > 0) {
        console.log(
          "Active Monitors:",
          monitors.map((m) => ({
            id: m._id,
            train: m.train,
            from: m.from,
            to: m.to,
            date: m.date,
            class: m.coachClass,
            quota: m.quota,
          }))
        );
      }

      for (const monitor of monitors) {
        console.log("\n----------------------------------------");
        console.log(`Checking Train ${monitor.train}`);
        console.log("----------------------------------------");

        try {
          console.log("Request Payload:");

          console.log({
            train: monitor.train,
            from: monitor.from,
            to: monitor.to,
            date: monitor.date,
            coachClass: monitor.coachClass,
            quota: monitor.quota,
          });

          const data = await checkAvailability({
            train: monitor.train,
            from: monitor.from,
            to: monitor.to,
            date: monitor.date,
            coachClass: monitor.coachClass,
            quota: monitor.quota,
          });

          console.log("RailKit Response:");
          console.log(JSON.stringify(data, null, 2));

          monitor.lastCheckedAt = new Date();

          console.log("Searching for CURR-AVL...");

          const availableSeat = data.availability.find((item) =>
            item.availabilityText.startsWith("CURR_AVL")
          );

          if (!availableSeat) {
            console.log("No seat available.");

            await monitor.save();

            continue;
          }

          console.log(
            "Seat Found:",
            availableSeat.availabilityText
          );

          console.log("Sending Push Notification...");

          const notificationResponse = await sendPushNotification(
            monitor.expoPushToken,
            "Seat Available 🎉",
            `${monitor.train} - ${availableSeat.availabilityText}`,
            {
              train: monitor.train,
              availability: availableSeat.availabilityText,
            }
          );

          console.log("Notification Response:");
          console.log(notificationResponse);

          monitor.active = false;
          monitor.notified = true;

          await monitor.save();

          console.log("Monitor updated.");
          console.log("Monitoring stopped.");
        } catch (err) {
          console.log("\n************* ERROR *************");

          console.error("Train:", monitor.train);

          console.error("Message:", err.message);

          console.error("Stack:");
          console.error(err.stack);

          if (err.response) {
            console.error("Status:", err.response.status);

            console.error("Response:");
            console.error(err.response.data);
          }

          console.error("Complete Error:");
          console.error(err);

          console.log("*******************************\n");
        }
      }
    } catch (err) {
      console.log("\n=========== CRON ERROR ===========");

      console.error(err);

      console.error(err.stack);

      console.log("==================================");
    }
  });

  console.log("RailKit monitor cron started.");
};