import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Charger les tâches depuis le backend
  useEffect(() => {
    axios.get("http://localhost:5000/tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddTask = () => {
    if (!newTask) return;
    axios.post("http://localhost:5000/tasks", { title: newTask })
      .then(res => {
        setTasks([res.data, ...tasks]);
        setNewTask("");
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter(t => t._id !== id)))
      .catch(err => console.error(err));
  };

  const toggleCompleted = (task) => {
    axios.put(`http://localhost:5000/tasks/${task._id}`, { completed: !task.completed })
      .then(res => {
        setTasks(tasks.map(t => t._id === task._id ? res.data : t));
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "50px auto",
      padding: 20,
      borderRadius: 10,
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>📝 Ma To-Do List</h1>

      <div style={{ display: "flex", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Ajouter une tâche..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
            fontSize: 16
          }}
        />
        <button
          onClick={handleAddTask}
          style={{
            padding: "10px 15px",
            marginLeft: 10,
            borderRadius: 5,
            border: "none",
            backgroundColor: "#4CAF50",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Ajouter
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map(task => (
          <li key={task._id} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            marginBottom: 8,
            borderRadius: 5,
            backgroundColor: task.completed ? "#d4edda" : "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}>
            <span
              onClick={() => toggleCompleted(task)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
                flex: 1
              }}
            >
              {task.title}
            </span>
            <button
              onClick={() => handleDelete(task._id)}
              style={{
                padding: "5px 10px",
                borderRadius: 5,
                border: "none",
                backgroundColor: "#f44336",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
