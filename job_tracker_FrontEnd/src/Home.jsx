import React from "react";
import { useState, useEffect } from "react";
import { UserCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewJobModel from "./NewJobModel";
import EditJobModel from "./EditJob";
import { BiSolidNotepad } from "react-icons/bi";
import { FilePlus } from "lucide-react";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [newJobModel, setNewJobModel] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [editModel, setEditModel] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEditClick = (job) => {
    setJobToEdit(job);
    setEditModel(true);
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleAddJob = (newJob) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
    setNewJobModel(false);
    console.log(newJob, "<-- JOB Added");
  };

  useEffect(() => {
    const getUsersJobs = async () => {
      const res = await fetch(`${import.meta.env.VITE_URL}/jobs/userJob`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setJobs(data);
    };
    getUsersJobs();
  }, []);

  const fetchDataByStatus = async (status) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL}/jobs/filter?status=${status}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs by status:", error);
    }
  };

  const showAllJobs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/jobs/userJob`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs by status:", error);
    }
  };

  const removeJob = async (job) => {
    // console.log(job)
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/jobs/${job.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting Job:", error);
    }
    const resUpdatedJob = await fetch(
      `${import.meta.env.VITE_URL}/jobs/userJob`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedData = await resUpdatedJob.json();
    setJobs(updatedData);
  };

  return (
    <main className="min-h-screen bg-[#5B5F97] p-6">

      {/* Top Center Icon and Title */}
      <div className="flex flex-col items-center mb-8">
        <BiSolidNotepad className="text-8xl text-[#1E2938]" />
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search job..."
          className="w-full sm:w-140 px-4 py-2 border-3 border-[#FFC246] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#FFFFFD]"
        />
      </div>

      {/* User Icon */}
      <div className="absolute top-6 right-6 z-50">
        <button
          className="text-gray-200 hover:text-gray-900 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <UserCircle size={40} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Post Job Button */}
      <div className="absolute top-20 right-6 z-40">
        <button
          type="button"
          onClick={() => setNewJobModel(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-full shadow hover:bg-green-700 transition duration-300"
        >
          <FilePlus className="text-2xl" />
        </button>
      </div>


      {/* Show All Jobs Button */}
      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={() => showAllJobs()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Show All Jobs
        </button>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {[
          { label: "Applied", color: "bg-blue-500", hover: "hover:bg-blue-600" },
          { label: "Interviewing", color: "bg-[#FFC246]", hover: "hover:bg-[#e0ac00]" },
          { label: "Rejected", color: "bg-red-500", hover: "hover:bg-red-600" },
          { label: "Offer", color: "bg-green-500", hover: "hover:bg-green-600" },
        ].map(({ label, color, hover }) => (
          <button
            key={label}
            type="button"
            onClick={() => fetchDataByStatus(label)}
            className={`bg-${color}-500 text-white px-6 py-2 rounded-md transition duration-200 ${color} ${hover}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Job Cards List */}
     <section className="max-w-5xl mx-auto px-4">
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg shadow">
      <thead>
        <tr className="text-left text-sm text-gray-600 border-b" style={{ borderBottom: "2px solid #FFC246" }}>
          <th className="py-3 px-4">Job Title</th>
          <th className="py-3 px-4">Company</th>
          <th className="py-3 px-4">Date</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs &&
          jobs.map((job, index) => (
            <tr
              key={index}
              className="text-sm text-gray-700 border-b hover:bg-gray-50 transition"
              style={{ borderBottom: "2px solid #FFC246" }}
            >
              <td className="py-3 px-4 font-medium">{job.job_title}</td>
              <td className="py-3 px-4">{job.company_name}</td>
              <td className="py-3 px-4">
                {new Date(job.application_date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    job.application_status === "Applied"
                      ? "bg-gray-300 text-gray-800"
                      : job.application_status === "Interviewing"
                      ? "bg-blue-300 text-blue-900"
                      : job.application_status === "Rejected"
                      ? "bg-red-300 text-red-900"
                      : job.application_status === "Offer"
                      ? "bg-green-300 text-green-900"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {job.application_status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(job)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeJob(job)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
</section>


      {/* Modals */}
      {newJobModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full relative">
            <button
              onClick={() => setNewJobModel(false)}
              className="absolute top-2 right-2 text-gray-400 hover:bg-gray-100 p-1 rounded group transition"
            >
              <X
                size={25}
                className="text-gray-400 group-hover:text-red-500 transition-colors"
              />
            </button>
            <NewJobModel
              onClose={() => setNewJobModel(false)}
              onAddJob={handleAddJob}
            />
          </div>
        </div>
      )}

      {editModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full relative">
            <button
              onClick={() => setEditModel(false)}
              className="absolute top-2 right-2 text-gray-400 hover:bg-gray-100 p-1 rounded group"
            >
              <X
                size={25}
                className="text-gray-400 group-hover:text-red-500 transition-colors"
              />
            </button>
            <EditJobModel
              setJobs={setJobs}
              job={jobToEdit}
              onClose={() => setEditModel(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
