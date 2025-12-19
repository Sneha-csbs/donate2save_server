import User from "../Model/UserModel.js";
import Request from "../Model/RequestModel.js";
import Appointment from "../Model/AppointmentModel.js";
import DonorHistory from "../Model/DonorHistoryModel.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all requests (admin view)
export const getAllRequestsAdmin = async (req, res) => {
  try {
    const requests = await Request.find().populate('requesterId', 'name orgName').sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete request (admin)
export const deleteRequestAdmin = async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all appointments (admin view)
export const getAllAppointmentsAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('donorId', 'name bloodGroup')
      .populate('requesterId', 'name orgName')
      .sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete appointment (admin)
export const deleteAppointmentAdmin = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all donor history (admin view)
export const getAllDonorHistoryAdmin = async (req, res) => {
  try {
    const history = await DonorHistory.find()
      .populate('donorId', 'name bloodGroup')
      .sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};