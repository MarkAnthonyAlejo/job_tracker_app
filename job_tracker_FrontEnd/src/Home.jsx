import React from "react";
import { useState, useEffect } from "react";
import { UserCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewJobModel from "./NewJobModel";
import EditJobModel from "./EditJob";

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
    <main className="min-h-screen bg-gray-100 p-6">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">J.T</h1>
        <input
          type="text"
          placeholder="Search job..."
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative">
          <button
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
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
      </header>

      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={() => showAllJobs()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Show All Jobs
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => fetchDataByStatus("Applied")}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Applied
        </button>
        <button
          type="button"
          onClick={() => fetchDataByStatus("Interviewing")}
          className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
        >
          Interviewing
        </button>
        <button
          type="button"
          onClick={() => fetchDataByStatus("Rejected")}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
        >
          Rejected
        </button>
        <button
          type="button"
          onClick={() => fetchDataByStatus("Offer")}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200"
        >
          Offer
        </button>
      </div>

      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={() => setNewJobModel(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition duration-300"
        >
          Post Job
        </button>
      </div>

      {newJobModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full relative">
            <button
              onClick={() => setNewJobModel(false)}
              className="absolute top-2 right-2 text-gray-400 hover:bg-gray-100 p-1 rounded group transition:"
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
              onClick={() => seteditModel(false)}
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

      <section className="max-w-2xl mx-auto">
        <ul className="space-y-4">
          {jobs &&
            jobs.map((job, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded-lg shadow transition hover:shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {job.job_title}
                </h2>
                <p className="text-gray-600">{job.company_name}</p>
                <p className="text-sm text-gray-500">
                  {job.application_status} - {""}
                  {new Date(job.application_date).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className="mt-2 text-gray-700">{job.description}</p>
                <button
                  onClick={() => handleEditClick(job)}
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeJob(job)}
                  className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
};

export default Home;
