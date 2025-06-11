import { supabase } from "../Connection/supabase.js";

//Gets a list of all the jobs
export const getAllJobs = async (req, res) => {
  const allJobs = await supabase.from("jobs").select("*");
  console.log(allJobs, "all jobs");
  res.status(200).json(allJobs);
};

//POST creates a new job
export const createJob = async (req, res) => {
  const {
    companyName,
    jobTitle,
    applicationStatus,
    applicationDate,
    description,
  } = req.body;
  const user_Id = req.user.id;

  try {
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        company_name: companyName,
        job_title: jobTitle,
        application_status: applicationStatus,
        application_date: applicationDate,
        description: description,
        user_id: user_Id,
      })
      .select();

    if (error) {
      console.error("Error inserting job:", error.message);
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Delete job
export const removeJob = async (req, res) => {
  const jobId = req.params.id;
  const user_Id = req.user.id;

  try {
    const { data: foundJob, error: findError } = await supabase
      .from("jobs")
      .select("job_title, id")
      .eq("id", jobId)
      .eq("user_id", user_Id);

    if (findError) {
      console.error("Error fetching job:", findError);
      return res
        .status(500)
        .json({ message: "Server error when checking job" });
    }

    if (!foundJob || foundJob.length == 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    console.log(foundJob, "<--- Job");

    const { error: deleteError } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId)
      .eq("user_id", user_Id);

    if (deleteError) {
      console.error("Error deleting job:", deleteError);
      return res.status(500).json({ message: "Failed to delete job" });
    }

    res.status(200).json({ message: `Job ${jobId} deleted` });
  } catch (error) {
    console.error("Unexpected server error:", error);
    res.status(500).json({ message: "Unexpected server error" });
  }
};

//Update Job
export const updateJob = async (req, res) => {
  const jobId = parseInt(req.params.id);
  const user_Id = req.user.id;

  const {
    companyName,
    jobTitle,
    applicationStatus,
    applicationDate,
    description,
  } = req.body;

  try {
    const { data, error } = await supabase
      .from("jobs")
      .update({
        company_name: companyName,
        job_title: jobTitle,
        application_status: applicationStatus,
        application_date: applicationDate,
        description: description,
      })
      .eq("id", jobId)
      .eq("user_id", user_Id)
      .select()
      .single();

    if (error) {
      console.error("Error updating job:", error);
      return res.status(500).json({ message: "Error updating job" });
    }

    if (!data) {
      return res.status(404).json({ message: `Job ${jobId} not found` });
    }

    console.log(data, "-->Updated Job");
    res.status(200).json({ message: `Job ${jobId} updated`, job: data });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected server error" });
  }
};

//Filter Job by Status (Applied,Interviewing,Rejected,Offer)
export const filterJobByStatus = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized: Missing user info" });
  }

  const user_Id = req.user.id;
  const { status } = req.query;
  console.log(status, "--> Status", user_Id, "ID");

  if (!status) {
    return res
      .status(400)
      .json({ message: "Status query parameter is required" });
  }

  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("application_status", status)
      .eq("user_id", user_Id);

    if (error) {
      console.error("Error filtering jobs by status:", error);
      return res.status(500).json({ message: "Error filtering jobs" });
    }

    console.log(data, "Job Status");
    res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Unexpected server error" });
  }
};

//Gets the Jobs by User
export const getJobByUser = async (req, res) => {
  const user_Id = req.user.id;

  if (!user_Id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", user_Id);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ message: "Error fetching jobs" });
    }

    console.log(jobs, "ID");
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
