import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useParams } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";

import { BsPlus } from "react-icons/bs";

function AddMemberTask({ projectId, tasks, setTasks }) {
  const [showTable, setShowTable] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({});

  const toggleTable = () => {
    setShowTable(!showTable);
  };

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        const membersResponse = await axiosClient.get(
          `/projects/${projectId}/members`
        );
        setMembers(membersResponse.data);
      } catch (error) {
        console.error("Error fetching project members:", error);
        toast.error("Failed to fetch project members. Please try again.");
      }
    };

    const fetchProjectDetails = async () => {
      try {
        const tasksResponse = await axiosClient.get(
          `/projects/${projectId}/tasks`
        );
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching project tasks:", error);
        toast.error("Failed to fetch project tasks. Please try again.");
      }
    };

    fetchProjectMembers();
    fetchProjectDetails();
  }, [projectId]);

  const handleTaskChange = (memberId, taskId) => {
    setSelectedTasks({ ...selectedTasks, [memberId]: taskId });
  };

  const handleAddMember = async (memberEmail) => {
    const member = members.find((mem) => mem.email === memberEmail);
    if (!member) {
      console.error("Member not found");
      return;
    }

    const taskId = selectedTasks[member.id];
    if (!taskId) {
      console.error("Task not selected");
      return;
    }

    try {
      const taskMembershipData = {
        email: member.email,
        taskId: taskId,
        projectId: projectId,
      };

      const response = await axiosClient.post(
        "/taskmemberships",
        taskMembershipData
      );

      if (response.status === 201) {
        toast.success("Member added to task successfully");
      } else if (response.status === 200) {
        toast.error("Member already added");
      }
    } catch (error) {
      console.error("Failed to add member to task:", error);
      toast.error("Failed to add member to task. Please try again.");
    }
  };

  return (
    <div className="">
      <BsPlus
        className="w-9 h-9 translate-y-2 cursor-pointer dark:text-white transform hover:scale-110 transition duration-300 ease-in-out"
        onClick={toggleTable}
      />
      {showTable && (
        <div className="overflow-y-scroll mb-11 mx-0 rounded-lg shadow-md bg-white dark:bg-opacity-30 bg-opacity-30 dark:bg-slate-900 p-4">
          <table className="mb-11 mx-0">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-2 text-midnightblue dark:text-white">
                  Name
                </th>
                <th className="px-4 py-2 text-midnightblue dark:text-white">
                  Email
                </th>
                <th className="px-4 py-2 text-midnightblue dark:text-white">
                  Task
                </th>
                <th className="px-4 py-2 text-midnightblue dark:text-white">
                  Add member
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-2">{member.name}</td>
                  <td className="px-4 py-2">{member.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={selectedTasks[member.id] || ""}
                      onChange={(e) =>
                        handleTaskChange(member.id, e.target.value)
                      }
                      className="bg-transparent outline-none px-4 py-2 rounded-md text-sm border border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
                    >
                      <option value="">Select a task</option>
                      {tasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleAddMember(member.email)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add member to task
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AddMemberTask;
