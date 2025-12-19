import express from "express";
import * as requestController from "../Controller/RequestController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create blood request
router.post("/", protect, requestController.createRequest);

// Get user's requests
router.get("/", protect, requestController.getUserRequests);

// Get all requests (for donors to view)
router.get("/all", protect, requestController.getAllRequests);

// Update request
router.put("/:id", protect, requestController.updateRequest);

// Delete request
router.delete("/:id", protect, requestController.deleteRequest);

export default router;