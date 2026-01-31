import Appointment from "../Model/AppointmentModel.js";
import DonorHistory from "../Model/DonorHistoryModel.js";

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    console.log('Creating appointment with data:', req.body);
    console.log('User:', req.user);
    
    // Validate required fields
    const { donorId, requesterId, bg, hospital, requestId } = req.body;
    if (!donorId || !requesterId || !bg || !hospital || !requestId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: donorId, requesterId, bg, hospital, requestId'
      });
    }
    
    const appointment = await Appointment.create(req.body);
    console.log('Appointment created:', appointment);
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's appointments (donor or requester)
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let appointments;
    if (userRole === 'donor') {
      appointments = await Appointment.find({ donorId: userId }).sort({ createdAt: -1 });
    } else if (userRole === 'requester') {
      appointments = await Appointment.find({ requesterId: userId }).sort({ createdAt: -1 });
    }
    
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status (only by requester who created it)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.id;
    
    // Find appointment and verify ownership
    const appointment = await Appointment.findOne({ 
      _id: req.params.id, 
      requesterId: userId 
    });
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or unauthorized" });
    }
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === "Completed" && { completedAt: new Date() }) },
      { new: true }
    );

    // If completed, add to donor history
    if (status === "Completed") {
      await DonorHistory.create({
        date: appointment.date,
        place: appointment.hospital,
        units: 1,
        donorId: appointment.donorId,
        completedAt: new Date()
      });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get donor appointments (for authenticated donor only)
export const getDonorAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: "Access denied. Donors only." });
    }
    
    const appointments = await Appointment.find({ donorId: userId }).sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send emergency contact request
export const sendEmergencyContact = async (req, res) => {
  try {
    const { donorId, message, requestId } = req.body;
    const requesterId = req.user.id;
    const hospitalName = req.user.orgName || req.user.name;
    
    // Import Notification model
    const { default: Notification } = await import('../Model/NotificationModel.js');
    const { default: Request } = await import('../Model/RequestModel.js');
    
    // Get request details for blood group
    const request = await Request.findById(requestId);
    
    // Create emergency notification in database
    await Notification.create({
      donorId,
      requesterId,
      hospitalName,
      bloodGroup: request?.bloodGroup || 'Unknown',
      message: message || `${hospitalName} urgently needs your help for blood donation`,
      type: 'emergency',
      requestId
    });
    
    res.status(200).json({
      success: true,
      message: 'Emergency contact request sent successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};