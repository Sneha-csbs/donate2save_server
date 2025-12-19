import express from "express";
import * as donateController from "../Controller/DonateController.js";

const router = express.Router();

// Create blood request (Requester)
router.post("/create", donateController.createRequest);

// Get all requests (Donor dashboard)
router.get("/requests", donateController.getAllRequests);

// Accept request (Donor)
router.put("/accept/:id", donateController.acceptRequest);

// Donation history
router.get("/history", donateController.getDonationHistory);

// Generate certificate
router.put("/certificate/:id", donateController.generateCertificate);

export default router;
