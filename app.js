import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import {
  configure,
  getAvailability,
} from "railkit";

import Monitor from "./model/Monitor.js";

import "./cron.js";

dotenv.config();

configure(process.env.RAILKIT_API_KEY);

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch(console.error);

app.post("/monitor", async (req, res) => {
  try {
    const monitor = await Monitor.create(req.body);

    res.json({
      success: true,
      monitor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/availability", async (req, res) => {
  try {
    const {
      train,
      from,
      to,
      date,
      coachClass,
      quota,
    } = req.query;

    const data = await getAvailability(
      train,
      from,
      to,
      date,
      coachClass,
      quota
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});