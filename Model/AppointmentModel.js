import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    donor: {
      type: String,
      required: true
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bg: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Accepted", "Pending", "Verified", "Completed"],
      default: "Pending"
    },
    requestId: {
      type: String,
      required: true
    },
    hospital: {
      type: String,
      required: true
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", AppointmentSchema);