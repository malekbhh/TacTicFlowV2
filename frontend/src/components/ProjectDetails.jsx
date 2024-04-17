import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useParams } from "react-router-dom";
import Alert from "./Alert";
import { Avatar } from "antd";
import ListTasks from "./test/ListTasks";
import toast, { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BsPlus } from "react-icons/bs";
import AddMemberTask from "./AddMemberTask.jsx";
import adduser from "../assets/adduser.png";
import { UserOutlined } from "@ant-design/icons"; // Import de l'icône utilisateur
const ProjectDetails = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [members1, setMembersAff] = useState([]);

  const [project, setProject] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isChef, setIsChef] = useState(false); // Ajout d'un état pour vérifier si l'utilisateur est chef de projet
  const [avatarURL, setAvatarURL] = useState(""); // Etat local pour stocker l'URL de l'avatar
  const [memberAdded, setMemberAdded] = useState("");
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await axiosClient.get(`/projects/${projectId}`);
        setProject(projectResponse.data);
        try {
          const response = await axiosClient.get(`/usersAccount`);
          const filteredData = response.data.data.map((user) => ({
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          }));
          setEmployees(filteredData);
          console.log(employees);
        } catch (error) {
          console.error("Error fetching users:", error);
        }

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

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        const membersResponse = await axiosClient.get(
          `/projects/${projectId}/members`
        );
        setMembersAff(membersResponse.data);
      } catch (error) {
        console.error("Error fetching project members:", error);
      }
    };

    fetchProjectMembers();
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

      try {
        const notificationResponse = await axiosClient.post(`/notifications`, {
          message: `Memeber ${employee.email} added to project `,
        });
        setTimeout(() => {
          window.location.reload(); // Recharge la page après 10 secondes
        }, 2000);
      } catch (error) {
        console.error("Error sending project notification:", error);
        toast.error("Error sending project notification. Please try again.");
      }
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
              <div className="flex   bg-opacity-30 w-full justify-between items-start">
                <div className="flex  items-start justify-start gap-6">
                  <h2 className=" font-semibold text-3xl mb-4">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    {members1.map((member, index) =>
                      member.avatar ? (
                        <img
                          key={index}
                          className="w-8 h-8 rounded-full mr-2"
                          src={member.avatar}
                          alt="Avatar"
                        />
                      ) : (
                        <Avatar
                          key={index}
                          className="w-8 h-8 rounded-full mr-2"
                          icon={<UserOutlined />}
                        />
                      )
                    )}
                  </div>

                  {/* {avatarURL && (
                    <div className="flex items-center">
                      <Avatar
                        className="w-8 h-8 rounded-full mr-2"
                        src={avatarURL}
                        icon={<UserOutlined />}
                      />
                      <p className="text-sm">{memberAdded}</p>
                    </div>
                  )} */}
                  {/* <p className="text-sm mb-6">{project.description}</p> */}
                </div>

                <div className="flex absolute  gap-8 top-24 right-2">
                  {" "}
                  {isChef && (
                    <button
                      onClick={toggleTable}
                      className="bg-white   flex p-2 rounded-full gap-2 dark:bg-gray-800"
                    >
                      <img className="h-6" src={adduser} alt="icon" />
                      <p className="text-[#9CA3AF]">Share</p>
                    </button>
                  )}
                  {isChef && (
                    <AddMemberTask
                      projectId={projectId}
                      tasks={tasks}
                      setTasks={setTasks}
                    />
                  )}
                </div>
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
              className={` flex justify-center items-start table-container mx-0 overflow-y-scroll rounded-lg h-[500px] shadow-md bg-white    dark:bg-slate-900 p-6 `}
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
                      <td className="px-4 py-2 flex items-center">
                        {/* Afficher l'avatar de l'employé s'il existe, sinon afficher une image par défaut */}
                        {employee.avatar ? (
                          <img
                            className="w-8 h-8 rounded-full mr-2"
                            src={employee.avatar}
                            alt="Avatar"
                          />
                        ) : (
                          <Avatar
                            className="w-8 h-8 rounded-full mr-2"
                            icon={<UserOutlined />}
                          />
                        )}
                        {employee.name}
                      </td>
                      <td className="px-4 py-2">{employee.email}</td>
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
      </div>
    </DndProvider>
  );
};

export default ProjectDetails;
