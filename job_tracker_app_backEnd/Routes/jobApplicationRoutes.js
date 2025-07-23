import express from "express";

const router = express.Router();

router.get("/", allJobApplied); //Gets a list of jobs applied
router.post("/", addJobApplication); //Adds a job to the jobs you apllied to
router.delete("/", removeJobApplication); //Removes a job that you appllied for

export default router;
