import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./Db/Db.js";

import donateRoute from "./Routes/DonateRoute.js";
import requestRoute from "./Routes/RequestRoute.js";
import appointmentRoute from "./Routes/AppointmentRoute.js";
import donorRoute from "./Routes/DonorRoute.js";
import authRoute from "./Routes/AuthRoute.js";
import adminRoute from "./Routes/AdminRoute.js";
import notificationRoute from "./Routes/NotificationRoute.js";

const app = express();

/* =====================================================
   🔥 MANUAL CORS HANDLER (FIXES PREFLIGHT 100%)
   ===================================================== */
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://donate2save.netlify.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // ✅ IMPORTANT: respond to preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

/* ===================================================== */

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
