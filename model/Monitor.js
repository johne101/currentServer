import mongoose from "mongoose";

const MonitorSchema = new mongoose.Schema({
  train: String,
  from: String,
  to: String,
  date: String,
  coachClass: String,
  quota: String,

  expoPushToken: String,

  active: {
    type: Boolean,
    default: true,
  },

  notified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Monitor", MonitorSchema);