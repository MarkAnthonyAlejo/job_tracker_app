import express from "express";
import jobRoutes from "./Routes/jobRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;
const router = express.Router();

app.get("/", (req, res) => {
  res.json({ message: "Job Tracker is live!" });
});

//  "http://localhost:5173",
//       "https://job-tracker-app-backend.onrender.com"

// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://weather-app-weld-two-37.vercel.app/",
//   "https://job-tracker-app-seven.vercel.app/",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

//https://job-tracker-app-backend.onrender.com --> This is the URL for the backend

app.use(cors());

//Routes
app.use(express.json());
app.use("/jobs", jobRoutes);
app.use("/users", userRoutes);
//Routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
