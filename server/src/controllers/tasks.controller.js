// server/src/controllers/tasks.controller.js
import {
    findAllTasks,
    findTaskById,
    insertTask,
    updateTaskStatus,
    deleteTask,
} from '../repositories/task.repository.js';

export async function getAllTasks(req, res) {
    try {
        const tasks = await findAllTasks(req.householdId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getTaskById(req, res) {
    try {
        const task = await findTaskById(req.params.id, req.householdId);
        if (!task) return res.status(404).json({ message: 'Tâche introuvable' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createTask(req, res) {
    const { title, type } = req.body;
    if (!title?.trim()) {
        return res.status(400).json({ message: 'Le titre est requis' });
    }
    if (!type) {
        return res.status(400).json({ message: 'Le type est requis' });
    }

    try {
        const id = await insertTask({ ...req.body, household_id: req.householdId });
        res.status(201).json({ id, message: 'Tâche créée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function updateTask(req, res) {
    try {
        const updated = await updateTaskStatus(req.params.id, req.householdId, req.body.status);
        if (!updated) return res.status(404).json({ message: 'Tâche introuvable' });
        res.json({ message: 'Tâche mise à jour' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function removeTask(req, res) {
    try {
        const deleted = await deleteTask(req.params.id, req.householdId);
        if (!deleted) return res.status(404).json({ message: 'Tâche introuvable' });
        res.json({ message: 'Tâche supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}