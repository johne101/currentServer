import Monitor from "../models/Monitor.js";

export const startMonitoring = async (req, res) => {
  try {
    const {
      expoPushToken,
      train,
      from,
      to,
      date,
      coachClass,
      quota,
    } = req.body;

    // Basic validation
    if (
      !expoPushToken ||
      !train ||
      !from ||
      !to ||
      !date ||
      !coachClass ||
      !quota
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Prevent duplicate active monitor
    const existing = await Monitor.findOne({
      train,
      from,
      to,
      date,
      coachClass,
      quota,
      active: true,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Already monitoring this journey.",
        monitor: existing,
      });
    }

    const monitor = await Monitor.create({
      expoPushToken,
      train,
      from,
      to,
      date,
      coachClass,
      quota,
    });

    res.status(201).json({
      success: true,
      message: "Monitoring started.",
      monitor,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const stopMonitoring = async (req, res) => {
  try {
    const { id } = req.params;

    const monitor = await Monitor.findByIdAndUpdate(
      id,
      {
        active: false,
      },
      {
        new: true,
      }
    );

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: "Monitor not found.",
      });
    }

    res.json({
      success: true,
      message: "Monitoring stopped.",
      monitor,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};