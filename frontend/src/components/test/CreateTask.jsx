// import React, { useState } from "react";
// import axiosClient from "../../axios-client";
// import toast from "react-hot-toast";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// function CreateTask({ projectId, setTasks }) {
//   const [taskName, setTaskName] = useState("");
//   const [dueDate, setDueDate] = useState(null);
//   const [showInput, setShowInput] = useState(false);

//   const handleShowInput = () => {
//     setShowInput(true);
//   };

//   const handleCreateTask = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosClient.post(`/projects/${projectId}/tasks`, {
//         title: taskName,
//         dueDate: dueDate, // Ajoutez la date d'échéance à l'objet de la tâche
//       });
//       toast.success("Task created successfully!");
//       setTaskName("");
//       setDueDate(null); // Réinitialiser la date après la création de la tâche
//       setTasks((prevTasks) => [...prevTasks, response.data]);
//       setShowInput(false); // Cacher l'entrée après la création de la tâche
//     } catch (error) {
//       console.error("Error creating task:", error);
//       toast.error("Error creating task. Please try again.");
//     }
//   };

//   return (
//     <div>
//       {!showInput && (
//         <button
//           onClick={handleShowInput}
//           className="bg-green-500 text-white px-4 py-2 rounded-3xl hover:bg-green-600 focus:outline-none"
//         >
//           Add Task
//         </button>
//       )}
//       {showInput && (
//         <form onSubmit={handleCreateTask}>
//           <input
//             type="text"
//             value={taskName}
//             onChange={(e) => setTaskName(e.target.value)}
//             placeholder="Enter task "
//             className="border-2 w-36 border-gray-300 opacity-90 rounded-s-xl   p-2  focus:outline-none"
//           />
//           <DatePicker
//             selected={dueDate}
//             onChange={(date) => setDueDate(date)}
//             placeholderText="Select date"
//             className="border-2 border-gray-300 w-32 opacity-90 rounded-r-xl p-2 mr-2 focus:outline-none"
//           />
//           <button
//             type="submit"
//             className="bg-green-500 text-white px-4 py-2 rounded-3xl hover:bg-green-600 focus:outline-none"
//           >
//             Create
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }

// export default CreateTask;
import React, { useState } from "react";
import axiosClient from "../../axios-client";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CreateTask({ projectId, setTasks }) {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [showInput, setShowInput] = useState(false);

  const handleShowInput = () => {
    setShowInput(true);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post(`/projects/${projectId}/tasks`, {
        title: taskName,
        dueDate: dueDate ? dueDate.toISOString().split("T")[0] : null, // Convertir la date au format YYYY-MM-DD
      });
      toast.success("Task created successfully!");
      setTaskName("");
      setDueDate(null); // Réinitialiser la date après la création de la tâche
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setShowInput(false); // Cacher l'entrée après la création de la tâche
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Error creating task. Please try again.");
    }
  };

  return (
    <div>
      {!showInput && (
        <button
          onClick={handleShowInput}
          className="bg-green-500 text-white px-4 py-2 rounded-3xl hover:bg-green-600 focus:outline-none"
        >
          Add Task
        </button>
      )}
      {showInput && (
        <form onSubmit={handleCreateTask}>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task "
            className="border-2 w-36 border-gray-300 rounded-xl p-2  focus:outline-none"
          />
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            placeholderText="Select date"
            className="border-2 border-gray-300 w-32 -translate-x-4 rounded-xl p-2 mr-2 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-3xl hover:bg-green-600 focus:outline-none"
          >
            Create
          </button>
        </form>
      )}
    </div>
  );
}

export default CreateTask;
