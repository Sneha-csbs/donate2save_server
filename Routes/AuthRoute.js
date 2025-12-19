import express from "express";
import * as authController from "../Controller/AuthController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Register user
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

// Get current user (protected)
router.get("/me", protect, authController.getMe);

export default router;