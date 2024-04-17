// import React, { useState, useEffect } from "react";
// import axiosClient from "../axios-client.js";
// import { useSelector } from "react-redux";
// import bin from "../assets/bin.png";
// import Alert from "./Alert";
// import toast, { Toaster } from "react-hot-toast";
// import search from "../assets/search.png";
// import { Link } from "react-router-dom";
// const Projects = () => {
//   const [projects, setProjects] = useState([]);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertType, setAlertType] = useState("danger");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [isLoadingProjects, setIsLoadingProjects] = useState(true);
//   const [loadProjectsError, setLoadProjectsError] = useState(null);

//   const loadProjects = async () => {
//     setIsLoadingProjects(true);
//     try {
//       const response = await axiosClient.get("/projects", {
//         headers: {
//           "X-CSRF-TOKEN": axiosClient.defaults.headers.common["X-CSRF-TOKEN"],
//         },
//       });
//       setProjects(response.data);
//       setLoadProjectsError(null); // Clear any previous errors
//     } catch (error) {
//       console.error("Erreur lors du chargement des projets :", error);
//     } finally {
//       setIsLoadingProjects(false);
//     }
//   };

//   useEffect(() => {
//     const xsrfTokenMatch = document.cookie.match(/XSRF-TOKEN=(.+);/);
//     const csrfToken = xsrfTokenMatch ? xsrfTokenMatch[1] : null;
//     if (csrfToken) {
//       axiosClient.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
//       loadProjects();
//     }
//   }, []);

//   const deleteProject = async (projectId) => {
//     if (
//       window.confirm(
//         "Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible."
//       )
//     ) {
//       try {
//         await axiosClient.delete(`/projects/${projectId}`, {
//           withCredentials: true,
//         });
//         toast.success("Project deleted successfully!");
//         loadProjects();
//       } catch (error) {
//         toast.error("Error deleting project!");
//         console.error(
//           `Erreur lors de la suppression du projet : ${error.message}`
//         );
//       }
//     }
//   };

//   return (
//     <div className="container w-full h-fit  pt-11 p-8  text-white">
//       {/* search bar */}
//       <div className=" fixed top-6 flex mt-2  items-center border-2 opacity-70 justify-between px-2 py-1 rounded-2xl w-80 gap-4">
//         <input
//           type="text"
//           className="bg-transparent w-80 focus:outline-none text-white "
//         />
//         <img src={search} alt="search icon" className="h-4 text-slate-500" />
//       </div>
//       <div className="w-80 mb-2">
//         {showAlert && (
//           <Alert
//             type={alertType}
//             message={alertMessage}
//             onClose={() => setShowAlert(false)}
//           />
//         )}
//       </div>
//       <h3 className="dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8">
//         Projects
//       </h3>
//       {loadProjectsError ? (
//         <p className="text-red-500">{loadProjectsError}</p>
//       ) : isLoadingProjects ? (
//         <p>Loading projects...</p>
//       ) : (
//         <div className="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xl:gap-5 gap-5">
//           {Array.isArray(projects) && projects.length > 0 ? (
//             projects.map((project) => (
//               <div key={project.id} className="mb-4 w-72 h-300">
//                 <Link to={`/project/${project.id}`}>
//                   <div className="dark:bg-black relative dark:bg-opacity-30 bg-white bg-opacity-30 rounded-lg overflow-hidden h-60 shadow-md flex flex-col">
//                     <div className="p-4 flex-1 overflow-y-auto">
//                       <h2
//                         className=" font-semibold text-gray-800 dark:text-white mb-2"
//                         style={{ fontSize: "small" }}
//                       >
//                         {project.title}
//                       </h2>
//                       <p
//                         className="text-gray-600 dark:text-gray-300 "
//                         style={{ fontSize: "small" }}
//                       >
//                         {project.description}
//                       </p>
//                       {project.deadline && (
//                         <p
//                           className="text-gray-500 absolute bottom-4  flex  items-end dark:text-gray-400 "
//                           style={{ fontSize: "small" }}
//                         >
//                           Deadline:{" "}
//                           {new Date(project.deadline).toLocaleDateString()}
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex justify-end p-4">
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault(); // Prevent the Link from triggering
//                           deleteProject(project.id);
//                         }}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         Supprimer
//                       </button>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))
//           ) : (
//             <p>Aucun projet trouvé.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Projects;

import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import search from "../assets/search.png";

const Projects = () => {
  const [chefProjects, setChefProjects] = useState([]);
  const [memberProjects, setMemberProjects] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [loadProjectsError, setLoadProjectsError] = useState(null);

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await axiosClient.get("/projectsWithRole", {
        headers: {
          "X-CSRF-TOKEN": axiosClient.defaults.headers.common["X-CSRF-TOKEN"],
        },
      });
      const { chefProjects, memberProjects } = response.data;
      setChefProjects(chefProjects);
      setMemberProjects(memberProjects);
      setLoadProjectsError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error loading projects:", error);
      setLoadProjectsError("Error loading projects. Please try again.");
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
    <div className="w-full h-full pt-11 p-8 text-white">
      {/* search bar */}
      <div className="fixed top-6 flex mt-2 items-center border-2 opacity-70 justify-between px-2 py-1 rounded-2xl w-80 gap-4">
        <input
          type="text"
          className="bg-transparent w-80 focus:outline-none text-white"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchInputChange}
        />
        <img src={search} alt="search icon" className="h-4 text-slate-500" />
      </div>

      <div className="w-full mb-2">
        <div className="w-full mb-2">
          <div className="w-full mb-2">
            {loadProjectsError ? (
              <p>{loadProjectsError}</p>
            ) : isLoadingProjects ? (
              <p>Loading projects...</p>
            ) : (
              <>
                <h3 className="text-gray-600 font-semibold mx-4 mb-2">
                  Projects
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xl:gap-5 gap-5">
                  {chefProjects
                    .filter(
                      (project) =>
                        project.title
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) ||
                        project.description
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                    )
                    .map((project) => (
                      <div key={project.id} className="mb-4 w-72 h-300">
                        <Link to={`/project/${project.id}`}>
                          <div className="dark:bg-black relative dark:bg-opacity-30 bg-white bg-opacity-30 rounded-lg overflow-hidden h-60 shadow-md flex flex-col">
                            <div className="p-4 flex-1 overflow-y-auto">
                              <h2
                                className="font-semibold text-gray-800 dark:text-white mb-2"
                                style={{ fontSize: "small" }}
                              >
                                {project.title}
                              </h2>
                              <p
                                className="text-gray-600 dark:text-gray-300 "
                                style={{ fontSize: "small" }}
                              >
                                {project.description}
                              </p>
                              {project.deadline && (
                                <p
                                  className="text-gray-500 absolute bottom-4 flex items-end dark:text-gray-400 "
                                  style={{ fontSize: "small" }}
                                >
                                  Deadline:{" "}
                                  {new Date(
                                    project.deadline
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="flex justify-end p-4">
                              <button
                                onClick={() => deleteProject(project.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
                <h3 className="text-gray-600 font-semibold mx-4 mb-2">
                  Projects Invited
                </h3>
                <div className="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xl:gap-5 gap-5">
                  {memberProjects
                    .filter(
                      (project) =>
                        project.title
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) ||
                        project.description
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                    )
                    .map((project) => (
                      <div key={project.id} className="mb-4 w-72 h-300">
                        <Link to={`/project/${project.id}`}>
                          <div className="dark:bg-black relative dark:bg-opacity-30 bg-white bg-opacity-30 rounded-lg overflow-hidden h-60 shadow-md flex flex-col">
                            <div className="p-4 flex-1 overflow-y-auto">
                              <h2
                                className="font-semibold text-gray-800 dark:text-white mb-2"
                                style={{ fontSize: "small" }}
                              >
                                {project.title}
                              </h2>
                              <p
                                className="text-gray-600 dark:text-gray-300 "
                                style={{ fontSize: "small" }}
                              >
                                {project.description}
                              </p>
                              {project.deadline && (
                                <p
                                  className="text-gray-500 absolute bottom-4 flex items-end dark:text-gray-400 "
                                  style={{ fontSize: "small" }}
                                >
                                  Deadline:{" "}
                                  {new Date(
                                    project.deadline
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="flex justify-end p-4">
                              <button
                                onClick={() => deleteProject(project.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
