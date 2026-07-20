import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema(
  {
    expoPushToken: {
      type: String,
      required: true,
    },

    train: {
      type: String,
      required: true,
    },

    from: {
      type: String,
      required: true,
      uppercase: true,
    },

    to: {
      type: String,
      required: true,
      uppercase: true,
    },

    date: {
      type: String,
      required: true,
    },

    coachClass: {
      type: String,
      required: true,
    },

    quota: {
      type: String,
      default: "GN",
    },

    active: {
      type: Boolean,
      default: true,
    },

    notified: {
      type: Boolean,
      default: false,
    },

    lastCheckedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Monitor", monitorSchema);