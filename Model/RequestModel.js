import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
    },
    units: {
      type: Number,
      required: true,
      min: 1
    },
    urgency: {
      type: String,
      required: true,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    },
    hospital: {
      type: String,
      required: true
    },
    notes: {
      type: String
    },
    status: {
      type: String,
      enum: ["open", "matched", "completed"],
      default: "open"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Request", RequestSchema);