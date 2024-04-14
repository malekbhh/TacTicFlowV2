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
import adduser from "../assets/adduser.png";
import exppic from "../assets/exppic.png";
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
      <div className=" h-screen  mt-6 justify-start flex flex-col border-slate-500  items-start gap-6">
        {project && (
          <div className="dark:text-white w-full text-midnightblue">
            <div className="flex flex-col lg:flex-row  justify-between  items-center ">
              <div className="flex -translate-x-2  bg-opacity-30 w-full justify-between items-start">
                <div className="flex items-start justify-start  flex-col">
                  <h2 className="text-xl font-semibold mb-4">
                    {project.title}
                  </h2>
                  <p className="text-sm mb-6">{project.description}</p>
                </div>
                {isChef && (
                  <button
                    onClick={toggleTable}
                    className="bg-white absolute top-0 right-0 flex p-2 rounded-full gap-2 dark:bg-gray-800"
                  >
                    <img className="h-6" src={adduser} alt="icon" />
                    <p className="text-[#9CA3AF]">Share</p>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <ListTasks
            isChef={isChef}
            projectId={projectId}
            tasks={tasks}
            setTasks={setTasks}
          />
        </div>

        {showTable && (
          <div
            onClick={(e) => {
              if (e.target !== e.currentTarget) {
                return;
              }
              setShowTable(false);
            }}
            className="fixed right-0 left-0 top-0 bottom-0 px-2 py-4 overflow-scroll z-50 justify-center items-center flex bg-[#00000080] scrollbar-hide"
          >
            <div
              className={` flex justify-center items-start table-container mx-0 overflow-y-scroll rounded-lg h-[500px] shadow-md bg-white    dark:bg-slate-900 p-6 w-[450px]`}
            >
              <table className="table-container ">
                <thead className="table-header ">
                  <tr>
                    <th className="px-4 py-2 text-midnightblue dark:text-white">
                      Profil
                    </th>
                    <th className="px-4 py-2 text-midnightblue dark:text-white">
                      Email
                    </th>
                    <th className="px-4 py-2 text-midnightblue dark:text-white"></th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {employees.map((employee) => (
                    <tr
                      className="border-t-2 border-b-2 border-indigo-300 "
                      key={employee.id}
                    >
                      <td className="flex  gap-4 justify-center items-center px-4 py-2">
                        <img
                          className=" w-8 h-8 rounded-full"
                          src={exppic}
                          alt="user photo"
                        />
                        {employee.name}
                      </td>
                      <td className="   px-4 py-2">{employee.email}</td>
                      <td className="px-4 flex items-center justify-center py-2">
                        {/* Appeler handleAddMember avec l'email de l'employé */}
                        <button
                          onClick={() => handleAddMember(employee.email)}
                          className="dark:bg-blue-500 bg-midnightblue  flex  hover:bg-blue-700 text-white font-bold py-1 px-4 items-center justify-center rounded-full "
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
