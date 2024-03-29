import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useSelector } from "react-redux";
import bin from "../assets/bin.png";
import Alert from "./Alert";
import toast, { Toaster } from "react-hot-toast";

import { Link } from "react-router-dom";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("danger");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [loadProjectsError, setLoadProjectsError] = useState(null);
  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await axiosClient.get("/projects", {
        headers: {
          "X-CSRF-TOKEN": axiosClient.defaults.headers.common["X-CSRF-TOKEN"],
        },
      });
      setProjects(response.data);
      setLoadProjectsError(null); // Clear any previous errors
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
      setLoadProjectsError(
        "An error occurred while loading projects. Please try again later."
      );
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    const xsrfTokenMatch = document.cookie.match(/XSRF-TOKEN=(.+);/);
    const csrfToken = xsrfTokenMatch ? xsrfTokenMatch[1] : null;
    if (csrfToken) {
      axiosClient.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
      loadProjects();
    }
  }, []);

  const deleteProject = async (projectId) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible."
      )
    ) {
      try {
        await axiosClient.delete(`/projects/${projectId}`, {
          withCredentials: true,
        });
        toast.success("Project deleted successfully!");
        loadProjects();
      } catch (error) {
        toast.error("Error deleting project!");
        console.error(
          `Erreur lors de la suppression du projet : ${error.message}`
        );
      }
    }
  };

  return (
    <div className="container h-screen mx-auto pt-11 p-8  text-white">
      <div className="w-80 mb-2">
        {showAlert && (
          <Alert
            type={alertType}
            message={alertMessage}
            onClose={() => setShowAlert(false)}
          />
        )}
      </div>
      <h3 className="dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8">
        Projects
      </h3>
      {loadProjectsError ? (
        <p className="text-red-500">{loadProjectsError}</p>
      ) : isLoadingProjects ? (
        <p>Loading projects...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="mb-4 h-300">
                <Link to={`/project/${project.id}`}>
                  <div className="dark:bg-black relative dark:bg-opacity-30 bg-white bg-opacity-30 rounded-lg overflow-hidden h-60 shadow-md flex flex-col">
                    <div className="p-4 flex-1 overflow-y-auto">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {project.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {project.description}
                      </p>
                      {project.deadline && (
                        <p className="text-gray-500 absolute bottom-4  flex  items-end dark:text-gray-400 text-sm">
                          Deadline:{" "}
                          {new Date(project.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end p-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent the Link from triggering
                          deleteProject(project.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>Aucun projet trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
