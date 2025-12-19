import express from "express";
import Notification from "../Model/NotificationModel.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get emergency notifications for donor
router.get("/emergency", protect, async (req, res) => {
  try {
    const donorId = req.user.id;
    
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: "Access denied. Donors only." });
    }
    
    const notifications = await Notification.find({
      donorId,
      type: 'emergency',
      read: false
    }).populate('requesterId', 'orgName name').sort({ createdAt: -1 });
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put("/:id/read", protect, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;