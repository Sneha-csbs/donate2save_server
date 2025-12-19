import mongoose from "mongoose";

const DonorHistorySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true
    },
    place: {
      type: String,
      required: true
    },
    units: {
      type: Number,
      required: true,
      default: 1
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("DonorHistory", DonorHistorySchema);