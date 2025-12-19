import Donate from "../Model/DonateModel.js";

/* ================= CREATE BLOOD REQUEST ================= */
export const createRequest = async (req, res) => {
  try {
    const data = await Donate.create(req.body);
    res.status(201).json({
      success: true,
      message: "Blood request created successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL REQUESTS (DONOR VIEW) ================= */
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Donate.find({ status: "REQUESTED" }).sort({
      createdAt: -1,
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ACCEPT REQUEST ================= */
export const acceptRequest = async (req, res) => {
  try {
    const updated = await Donate.findByIdAndUpdate(
      req.params.id,
      { status: "ACCEPTED" },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= DONATION HISTORY ================= */
export const getDonationHistory = async (req, res) => {
  try {
    const history = await Donate.find({ status: "COMPLETED" });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GENERATE CERTIFICATE ================= */
export const generateCertificate = async (req, res) => {
  try {
    const cert = await Donate.findByIdAndUpdate(
      req.params.id,
      { certificateGenerated: true },
      { new: true }
    );
    res.json({
      message: "Certificate generated",
      cert,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
