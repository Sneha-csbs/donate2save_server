import express from "express";
import * as adminController from "../Controller/AdminController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(restrictTo('admin'));

// User management
router.get("/users", adminController.getAllUsers);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Request management
router.get("/requests", adminController.getAllRequestsAdmin);
router.delete("/requests/:id", adminController.deleteRequestAdmin);

// Appointment management
router.get("/appointments", adminController.getAllAppointmentsAdmin);
router.delete("/appointments/:id", adminController.deleteAppointmentAdmin);

// Donor history management
router.get("/donor-history", adminController.getAllDonorHistoryAdmin);

export default router;