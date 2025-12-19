import mongoose from "mongoose";
import User from "../Model/UserModel.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/donate2save");
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }
    
    // Create admin user
    const adminUser = await User.create({
      name: "Admin",
      email: "admin@donate2save.com",
      password: "admin12345",
      role: "admin"
    });
    
    console.log("Admin user created successfully:");
    console.log("Email: admin@donate2save.com");
    console.log("Password: admin12345");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();