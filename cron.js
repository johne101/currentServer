import cron from "node-cron";
import Monitor from "./model/Monitor.js";
import { checkTrainAvailability } from "./services/checker.js";

cron.schedule("*/5 * * * *", async () => {
  console.log("Checking monitored trains...");

  const monitors = await Monitor.find({
    active: true,
    notified: false,
  });

  for (const monitor of monitors) {
    await checkTrainAvailability(monitor);
  }
});