import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/donate2save";
    console.log("Connecting to MongoDB:", mongoUrl);
    
    await mongoose.connect(mongoUrl);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
