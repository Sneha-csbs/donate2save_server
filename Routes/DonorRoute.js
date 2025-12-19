import express from "express";
import * as donorController from "../Controller/DonorController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get authenticated donor's history
router.get("/history", protect, donorController.getDonorHistory);

// Get authenticated donor's stats
router.get("/stats", protect, donorController.getDonorStats);

// Check authenticated donor's eligibility
router.get("/eligibility", protect, donorController.checkEligibility);

// Get donors by blood group (for requesters)
router.get("/bloodgroup/:bloodGroup", protect, donorController.getDonorsByBloodGroup);

export default router;