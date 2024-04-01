import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useParams } from "react-router-dom";
import Alert from "./Alert";
import CreateTask from "./test/CreateTask";
import ListTasks from "./test/ListTasks";
import toast, { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BsPlus } from "react-icons/bs";
import AddMemberTask from "./AddMemberTask.jsx";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isChef, setIsChef] = useState(false); // Ajout d'un état pour vérifier si l'utilisateur est chef de projet

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await axiosClient.get(`/projects/${projectId}`);
        setProject(projectResponse.data);

        const employeesResponse = await axiosClient.get(`/employees`);
        setEmployees(employeesResponse.data);

        const tasksResponse = await axiosClient.get(
          `/projects/${projectId}/tasks`
        );
        setTasks(tasksResponse.data);

        const userResponse = await axiosClient.get("/user");
        const user = userResponse.data;
        if (user && user.id) {
          const isChefResponse = await axiosClient.post(
            "/check-chef-permissions",
            {
              projectId: projectId,
              userId: user.id,
            }
          );
          setIsChef(isChefResponse.data.isChef); // Mis à jour de l'état en fonction de la réponse
        }
      } catch (error) {
        console.error("Error loading project details:", error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const toggleTable = () => {
    setShowTable(!showTable);
  };

  const handleAddMember = async (employeeEmail) => {
    const employee = employees.find((emp) => emp.email === employeeEmail);
    if (!employee) {
      console.error("Employee not found");
      return;
    }

    try {
      // Enregistrez l'utilisateur en tant que membre du projet avec le rôle "member"
      const membershipData = {
        email: employee.email, // Envoyer uniquement l'e-mail de l'employé
        project_id: projectId, // Envoyer l'ID du projet
      };

      await axiosClient.post("/memberships", membershipData);

      toast.success("Member added successfully");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to add member");
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <div className="rounded-[30px] h-screen w-full mt-6 justify-start flex flex-col border-slate-500 pb-6 items-start gap-6">
        <div className="accesschef">
          {" "}
          {project && (
            <div className="dark:text-white w-full text-midnightblue">
              <div className="flex flex-col lg:flex-row gap-7  items-center ">
                <div className="flex">
                  <div className="flex items-start justify-start  flex-col">
                    <h2 className="text-3xl font-semibold    dark:text-white">
                      {project.title}
                    </h2>
                    <p className="text-lg  text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                  </div>
                  {isChef && (
                    <BsPlus
                      className="w-9 h-9    translate-y-2 cursor-pointer  dark:text-white transform hover:scale-110 transition duration-300 ease-in-out"
                      onClick={toggleTable}
                    />
                  )}
                </div>
                {showTable && (
                  <div className="overflow-y-scroll rounded-lg shadow-md bg-white dark:bg-opacity-30 bg-opacity-30 dark:bg-slate-900 p-4">
                    <table className="table-container mx-0">
                      <thead className="table-header ">
                        <tr>
                          <th className="px-4 py-2 text-midnightblue dark:text-white">
                            Name
                          </th>
                          <th className="px-4 py-2 text-midnightblue dark:text-white">
                            Email
                          </th>
                          <th className="px-4 py-2 text-midnightblue dark:text-white">
                            Add member
                          </th>
                        </tr>
                      </thead>
                      <tbody className="table-body">
                        {employees.map((employee) => (
                          <tr key={employee.id}>
                            <td className="px-4 py-2">{employee.name}</td>
                            <td className="px-4 py-2">{employee.email}</td>
                            <td className="px-4 flex items-center justify-center py-2">
                              {/* Appeler handleAddMember avec l'email de l'employé */}
                              <button
                                onClick={() => handleAddMember(employee.email)}
                                className="bg-blue-500 flex  hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                              >
                                Add
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {isChef && (
          <CreateTask
            projectId={projectId}
            setTasks={setTasks}
            className="mb-5"
          />
        )}
        <ListTasks projectId={projectId} tasks={tasks} setTasks={setTasks} />
        {isChef && (
          <AddMemberTask
            projectId={projectId}
            tasks={tasks}
            setTasks={setTasks}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default ProjectDetails;
