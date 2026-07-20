import express from "express";
import {
  startMonitoring,
  stopMonitoring,
} from "../controllers/monitor.controller.js";

const router = express.Router();

// Start Monitoring
router.post("/", startMonitoring);

// Stop Monitoring
router.delete("/:id", stopMonitoring);

export default router;