import mongoose from "mongoose";

const DonateSchema = new mongoose.Schema(
  {
    // Donor details
    donorName: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },

    // Requester / Hospital details
    hospitalName: {
      type: String,
      required: true,
    },

    urgency: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    // Donation status
    status: {
      type: String,
      enum: ["REQUESTED", "ACCEPTED", "COMPLETED"],
      default: "REQUESTED",
    },

    // History
    donationDate: {
      type: Date,
    },

    // Certificates
    certificateGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Donate", DonateSchema);
