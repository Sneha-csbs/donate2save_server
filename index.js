import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./Db/Db.js";
import donateRoute from "./Routes/DonateRoute.js";
import requestRoute from "./Routes/RequestRoute.js";
import appointmentRoute from "./Routes/AppointmentRoute.js";
import donorRoute from "./Routes/DonorRoute.js";
import authRoute from "./Routes/AuthRoute.js";
import adminRoute from "./Routes/AdminRoute.js";
import notificationRoute from "./Routes/NotificationRoute.js";

const app = express();

// Middleware
app.use(cors({
  origin: ['https://donate2save.netlify.app', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/api/auth", authRoute);
app.use("/api/donate", donateRoute);
app.use("/api/requests", requestRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/donors", donorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/notifications", notificationRoute);

app.get("/", (req, res) => {
  res.send("Donate2Save Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
