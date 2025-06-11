import express from "express";
import jobRoutes from "./Routes/jobRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 8081;
const router = express.Router();

// app.get("/home", (req, res) => {
//   res.json({ message: "Hello from Express + ES Modules!" });
// });

app.get("/", (req, res) => {
  res.json({ message: "Job Tracker is live!" });
});

app.use(
  cors({
    origin: "http://localhost:5173",
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
