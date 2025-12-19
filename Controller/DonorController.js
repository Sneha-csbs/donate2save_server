import DonorHistory from "../Model/DonorHistoryModel.js";

// Get authenticated donor's history
export const getDonorHistory = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: "Access denied. Donors only." });
    }
    
    const history = await DonorHistory.find({ donorId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get authenticated donor's stats
export const getDonorStats = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: "Access denied. Donors only." });
    }
    
    const donorId = req.user.id;
    const history = await DonorHistory.find({ donorId });
    
    const currentYear = new Date().getFullYear();
    const thisYearDonations = history.filter(h => 
      new Date(h.completedAt).getFullYear() === currentYear
    );

    const stats = {
      totalDonations: history.length,
      thisYear: thisYearDonations.length
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check authenticated donor's eligibility
export const checkEligibility = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: "Access denied. Donors only." });
    }
    
    const donorId = req.user.id;
    const history = await DonorHistory.find({ donorId }).sort({ completedAt: -1 });
    
    if (history.length === 0) {
      return res.status(200).json({ eligible: true, message: "Eligible to Donate" });
    }

    const lastDonation = history[0];
    const lastDonationTime = new Date(lastDonation.completedAt);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    if (lastDonationTime > oneHourAgo) {
      const timeLeft = Math.ceil((lastDonationTime.getTime() + 60 * 60 * 1000 - Date.now()) / (1000 * 60));
      return res.status(200).json({ 
        eligible: false, 
        message: `Wait ${timeLeft} minutes before next donation` 
      });
    }

    res.status(200).json({ eligible: true, message: "Eligible to Donate" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donors by exact blood group match with eligibility
export const getDonorsByBloodGroup = async (req, res) => {
  try {
    const { bloodGroup } = req.params;
    
    // Import User model here to avoid circular dependency
    const User = (await import('../Model/UserModel.js')).default;
    
    // Get donors with exact blood group match
    const donors = await User.find({
      role: 'donor',
      bloodGroup: bloodGroup
    }).select('_id name bloodGroup city phone');
    
    // Check eligibility for each donor
    const donorsWithEligibility = await Promise.all(
      donors.map(async (donor) => {
        const history = await DonorHistory.find({ donorId: donor._id }).sort({ completedAt: -1 });
        
        let eligible = true;
        let eligibilityMessage = "Available";
        
        if (history.length > 0) {
          const lastDonation = history[0];
          const lastDonationTime = new Date(lastDonation.completedAt);
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          
          if (lastDonationTime > oneHourAgo) {
            const timeLeft = Math.ceil((lastDonationTime.getTime() + 60 * 60 * 1000 - Date.now()) / (1000 * 60));
            eligible = false;
            eligibilityMessage = `Wait ${timeLeft} minutes`;
          }
        }
        
        return {
          _id: donor._id,
          name: donor.name,
          bloodGroup: donor.bloodGroup,
          city: donor.city,
          phone: donor.phone,
          eligible,
          eligibilityMessage
        };
      })
    );
    
    res.status(200).json(donorsWithEligibility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};