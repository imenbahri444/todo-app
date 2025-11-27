const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();

// Middleware
app.use(cors()); // autoriser les requêtes depuis le frontend
app.use(express.json()); // pour lire les requêtes JSON

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/todoApp')
  .then(() => console.log('Connecté à la base MongoDB'))
  .catch(err => console.log('Erreur MongoDB :', err));

// GET : récupérer toutes les tâches
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
  }
});

// POST : ajouter une tâche
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  try {
    const task = new Task({ title });
    await task.save();
    res.status(201).json(task); // renvoie la tâche créée
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de la tâche' });
  }
});

// DELETE : supprimer une tâche
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
  }
});

// PUT : marquer une tâche comme terminée
app.put('/tasks/:id', async (req, res) => {
  const { completed } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true } // renvoie la tâche mise à jour
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche' });
  }
});

// Démarrer le serveur
app.listen(5000, () => {
  console.log("Serveur backend en cours sur http://localhost:5000");
});
