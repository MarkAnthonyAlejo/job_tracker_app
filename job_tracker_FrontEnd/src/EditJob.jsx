import React, { useEffect } from "react";
import { useState } from "react";

const EditJob = ({ job, onClose, setJobs }) => {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (job) {
      setCompanyName(job.company_name || "");
      setJobTitle(job.job_title || "");
      setStatus(job.application_status || "");
      setDate(job.application_date ? job.application_date.split("T")[0] : "");
      setDescription(job.description || "");
    }
  }, [job]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/${job.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName,
          jobTitle,
          applicationStatus: status,
          applicationDate: date,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to udpate job");
      }

      const updateJob = await response.json();

      const resUpdatedJob = await fetch(`${process.env.REACT_APP_API_URL}/jobs/userJob`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedData = await resUpdatedJob.json();
      setJobs(updatedData);
      console.log(updatedData);

      onClose();
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job. Please try again.");
    }
  };

  return (
    <>
      <form className="space-y-4 p-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name:
          </label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-non focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title:
          </label>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Application Status:
          </label>
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Application Date:
          </label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {date && (
            <p className="mt-1 text-sm text-gray-600">
              Selected Date: {new Date(date).toLocaleDateString()}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Desciption:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </>
  );
};

export default EditJob;