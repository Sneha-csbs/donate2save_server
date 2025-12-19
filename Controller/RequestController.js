import Request from "../Model/RequestModel.js";

// Create blood request (only by requester)
export const createRequest = async (req, res) => {
  try {
    if (req.user.role !== 'requester') {
      return res.status(403).json({ message: "Access denied. Requesters only." });
    }
    
    const requestData = {
      ...req.body,
      requesterId: req.user.id
    };
    
    console.log('Creating request with data:', requestData);
    const request = await Request.create(requestData);
    console.log('Created request:', request);
    
    res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Request creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's requests (only requester's own requests)
export const getUserRequests = async (req, res) => {
  try {
    if (req.user.role !== 'requester') {
      return res.status(403).json({ message: "Access denied. Requesters only." });
    }
    
    const requests = await Request.find({ requesterId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all requests (for donors to view)
export const getAllRequests = async (req, res) => {
  try {
    // Only return requests that have a valid requesterId (created by authenticated requesters)
    const requests = await Request.find({ 
      requesterId: { $exists: true, $ne: null } 
    }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update request (only by requester who created it)
export const updateRequest = async (req, res) => {
  try {
    if (req.user.role !== 'requester') {
      return res.status(403).json({ message: "Access denied. Requesters only." });
    }
    
    const request = await Request.findOneAndUpdate(
      { _id: req.params.id, requesterId: req.user.id },
      req.body,
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: "Request not found or unauthorized" });
    }
    
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete request (only by requester who created it)
export const deleteRequest = async (req, res) => {
  try {
    if (req.user.role !== 'requester') {
      return res.status(403).json({ message: "Access denied. Requesters only." });
    }
    
    const request = await Request.findOneAndDelete({ 
      _id: req.params.id, 
      requesterId: req.user.id 
    });
    
    if (!request) {
      return res.status(404).json({ message: "Request not found or unauthorized" });
    }
    
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};