import express from "express";
import {
  getAllJobs,
  createJob,
  removeJob,
  updateJob,
  filterJobByStatus,
  getJobByUser,
} from "../Controller/jobController.js";
import { authenticateToken } from "../Middleware/authenticateToken.js";

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", authenticateToken, createJob);
router.delete("/:id", authenticateToken, removeJob);
router.patch("/:id", authenticateToken, updateJob);
router.get("/filter", authenticateToken, filterJobByStatus);
router.get("/userJob", authenticateToken, getJobByUser);

export default router;
