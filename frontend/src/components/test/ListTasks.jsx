import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDrag, useDrop } from "react-dnd";
import axiosClient from "../../axios-client";
import plus from "./plus.png";
function ListTasks({ projectId, tasks, setTasks }) {
  const [todos, setTodos] = useState([]);
  const [doings, setDoings] = useState([]);
  const [dones, setDones] = useState([]);
  const [closeds, setCloseds] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosClient.get(`/projects/${projectId}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [projectId, setTasks]);

  useEffect(() => {
    const filteredTodos = tasks.filter((task) => task.status === "To Do");
    const filteredDoings = tasks.filter((task) => task.status === "Doing");
    const filteredDones = tasks.filter((task) => task.status === "Done");
    const filteredClosed = tasks.filter((task) => task.status === "Closed");

    setTodos(filteredTodos);
    setDoings(filteredDoings);
    setDones(filteredDones);
    setCloseds(filteredClosed);
  }, [tasks]);

  const statuses = ["To Do", "Doing", "Done", "Closed"];

  return (
    <div className="flex gap-16">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          doings={doings}
          dones={dones}
          closeds={closeds}
        />
      ))}
    </div>
  );
}

export default ListTasks;
const Section = ({
  status,
  tasks,
  setTasks,
  todos,
  doings,
  dones,
  closeds,
}) => {
  const fetchTasks = async () => {
    try {
      const response = await axiosClient.get(`/projects/${projectId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: async (item) => {
      try {
        // Use POST request to update task status
        await axiosClient.post(`/tasks/${item.id}/status`, { status });

        // Update local task state after successful database update
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === item.id ? { ...task, status } : task
          )
        );
        toast.success("Task updated successfully");
        fetchTasks();
      } catch (error) {
        console.error("Error updating task:", error);
        toast.error("Error updating task. Please try again.");
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  let text = "todo";
  let bg = "bg-slate-500";
  let tasksToMap = todos;
  if (status === "Doing") {
    text = "doing ";
    bg = "bg-purple-500";
    tasksToMap = doings;
  }
  if (status === "Done") {
    text = "done ";
    bg = "bg-green-500";
    tasksToMap = dones;
  }
  if (status === "Closed") {
    text = "closed ";
    bg = "bg-red-500";
    tasksToMap = closeds;
  }
  const addItemToSection = (id) => {
    setTasks((prev) => {
      const mTasks = prev.map((t) => {
        if (t.id === id) {
          return { ...t, status: status };
        }
        return t;
      });
      return mTasks;
    });
  };
  return (
    <div
      ref={drop}
      className={` bg-white bg-opacity-30 w-60 min-h-40 h-fit  dark:bg-black dark:bg-opacity-30 rounded-lg p-2 ${
        isOver ? "bg-opacity-30" : "bg-opacity-70"
      }`}
    >
      {" "}
      <Header text={text} bg={bg} count={tasksToMap.length} />{" "}
      {tasksToMap.length > 0 &&
        tasksToMap.map((task) => (
          <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
        ))}
    </div>
  );
};
const Header = ({ text, bg, count }) => {
  return (
    <div
      className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white`}
    >
      {text}
      <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center">
        {count}
      </div>
    </div>
  );
};
const Task = ({ task, tasks, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  console.log(isDragging);

  const handleremove = async (id) => {
    try {
      // Envoyer une requête DELETE pour supprimer la tâche du backend
      await axiosClient.delete(`/tasks/${id}`);

      // Mettre à jour l'état local des tâches après la suppression réussie
      const fTasks = tasks.filter((t) => t.id !== id);
      localStorage.setItem("tasks", JSON.stringify(fTasks));
      setTasks(fTasks);
      toast("Task removed", { icon: "👽" });
    } catch (error) {
      console.error("Error removing task:", error);
      toast.error("Error removing task. Please try again.");
    }
  };

  return (
    <div
      ref={drag}
      className={`relative p-4 mt-8 shadow-md dark:shadow-slate-400 dark:shadow-sm rounded-md cursor-grab ${
        isDragging ? "opacity-25" : " opacity-100"
      }`}
    >
      <p className="text-black dark:text-white ">{task.title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {task.due_date}
      </p>{" "}
      <button
        className="absolute bottom-1 right-1 text-slate-400 "
        onClick={() => handleremove(task.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
};
