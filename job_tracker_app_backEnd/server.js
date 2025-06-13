import express from "express";
import jobRoutes from "./Routes/jobRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;
const router = express.Router();
const allowedOrigins = [
  "http://localhost:5173",
  "http://https://job-tracker-app-seven.vercel.app",
];

app.get("/", (req, res) => {
  res.json({ message: "Job Tracker is live!" });
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//Routes
app.use(express.json());
app.use("/jobs", jobRoutes);
app.use("/users", userRoutes);
//Routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
