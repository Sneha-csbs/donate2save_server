import express from "express";
import * as appointmentController from "../Controller/AppointmentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create appointment
router.post("/", protect, appointmentController.createAppointment);

// Get user's appointments
router.get("/", protect, appointmentController.getUserAppointments);

// Update appointment status
router.put("/:id", protect, appointmentController.updateAppointmentStatus);

// Get donor appointments (for authenticated donor only)
router.get("/donor", protect, appointmentController.getDonorAppointments);

// Send emergency contact request
router.post("/emergency-contact", protect, appointmentController.sendEmergencyContact);

export default router;