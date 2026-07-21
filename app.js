import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import monitorRoutes from "./routes/monitor.routes.js";
import { startCronJob } from "./services/cron.service.js";

dotenv.config();

const app = express();

app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected")
        startCronJob();

  })
  .catch(console.error);

// Routes
app.use("/monitor", monitorRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server running"
  });
});
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});