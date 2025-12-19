import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospitalName: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['emergency', 'contact_request', 'appointment'],
    default: 'emergency'
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Notification", notificationSchema);