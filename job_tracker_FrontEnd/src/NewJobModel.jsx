import React from "react";
import { useState } from "react";

const NewJobModel = ({ onClose, onAddJob }) => {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  const addJob = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        companyName,
        jobTitle,
        applicationStatus,
        applicationDate,
        description,
      }),
    });
    console.log(res, "RES");

    if (res.ok) {
      const data = await res.json();
      console.log(data, "<--data");
      onAddJob(data);
      onClose();
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Job</h1>
      <form className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name:
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title:
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Application Status:
          </label>
          <input
            type="text"
            value={applicationStatus}
            onChange={(e) => setApplicationStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Application Date:
          </label>
          <input
            type="date"
            value={applicationDate}
            onChange={(e) => setApplicationDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description:
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          onClick={addJob}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Submit Job
        </button>
      </form>
    </>
  );
};

export default NewJobModel;
