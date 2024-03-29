import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useParams } from "react-router-dom";
import Alert from "./Alert";
import CreateTask from "./test/CreateTask";
import ListTasks from "./test/ListTasks";
import toast, { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axiosClient.get(`/projects/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des détails du projet :",
          error
        );
      }
    };

    fetchProjectDetails();
  }, [projectId]);
  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <div className=" rounded-[30px] mt-6  justify-start flex flex-col border-slate-500 pb-6 h-full  items-start gap-6">
        {project && (
          <div className="dark:text-white text-midnightblue ">
            <h2 className="text-3xl font-semibold mb-4">{project.title}</h2>
            <p className="text-lg mb-6">{project.description}</p>
          </div>
        )}
        <CreateTask
          projectId={projectId}
          setTasks={setTasks}
          className="mb-5"
        />
        <ListTasks projectId={projectId} tasks={tasks} setTasks={setTasks} />
      </div>
    </DndProvider>
  );
};
export default ProjectDetails;
