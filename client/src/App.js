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

  // Ajouter une tâche
  const handleAddTask = () => {
    if (!newTask) return;
    axios.post("http://localhost:5000/tasks", { title: newTask })
      .then(res => {
        setTasks([res.data, ...tasks]);
        setNewTask("");
      })
      .catch(err => console.error(err));
  };

  // Supprimer une tâche
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter(t => t._id !== id)))
      .catch(err => console.error(err));
  };

  // Marquer une tâche comme terminée
  const toggleCompleted = (task) => {
    axios.put(`http://localhost:5000/tasks/${task._id}`, { completed: !task.completed })
      .then(res => {
        setTasks(tasks.map(t => t._id === task._id ? res.data : t));
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Liste des tâches</h1>

      <input
        type="text"
        placeholder="Ajouter une tâche"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleAddTask} style={{ marginLeft: 8 }}>Ajouter</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map(task => (
          <li key={task._id} style={{ margin: "8px 0" }}>
            <span
              onClick={() => toggleCompleted(task)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer"
              }}
            >
              {task.title}
            </span>
            <button onClick={() => handleDelete(task._id)} style={{ marginLeft: 10 }}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
