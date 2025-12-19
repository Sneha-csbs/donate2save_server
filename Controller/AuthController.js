import User from "../Model/UserModel.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "donate2save_secret", {
    expiresIn: "30d",
  });
};

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, bloodGroup, city, phone, orgName, contact } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user data based on role
    const userData = {
      name,
      email,
      password,
      role,
    };

    if (role === "donor") {
      userData.bloodGroup = bloodGroup;
      userData.city = city;
      userData.phone = phone;
    } else if (role === "requester") {
      userData.orgName = orgName;
      userData.contact = contact;
      userData.city = city;
    }

    const user = await User.create(userData);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(role === "donor" && {
          bloodGroup: user.bloodGroup,
          city: user.city,
          phone: user.phone,
        }),
        ...(role === "requester" && {
          orgName: user.orgName,
          contact: user.contact,
          city: user.city,
        }),
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.role === "donor" && {
          bloodGroup: user.bloodGroup,
          city: user.city,
          phone: user.phone,
        }),
        ...(user.role === "requester" && {
          orgName: user.orgName,
          contact: user.contact,
          city: user.city,
        }),
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};