// server/src/controllers/categories.controller.js
import {
    findAllCategories,
    findCategoryById,
    insertCategory,
    updateCategory as updateCategoryRepo,
    countTasksUsingCategory,
    deleteCategory as deleteCategoryRepo,
} from '../repositories/category.repository.js';

export async function getAllCategories(req, res) {
    try {
        const categories = await findAllCategories(req.householdId);
        res.json(categories);
    } catch (error) {
        console.error('Erreur getAllCategories:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function createCategory(req, res) {
    const { name, color } = req.body;
    if (!name?.trim()) {
        return res.status(400).json({ message: 'Le nom est requis' });
    }
    if (!color?.trim()) {
        return res.status(400).json({ message: 'La couleur est requise' });
    }

    try {
        const id = await insertCategory(req.householdId, name.trim(), color.trim());
        res.status(201).json({ id, name: name.trim(), color: color.trim() });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Cette catégorie existe déjà' });
        }
        console.error('Erreur createCategory:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function editCategory(req, res) {
    const { name, color } = req.body;
    if (!name?.trim()) {
        return res.status(400).json({ message: 'Le nom est requis' });
    }
    if (!color?.trim()) {
        return res.status(400).json({ message: 'La couleur est requise' });
    }

    try {
        const updated = await updateCategoryRepo(req.params.id, req.householdId, name.trim(), color.trim());
        if (!updated) return res.status(404).json({ message: 'Catégorie introuvable' });
        res.json({ message: 'Catégorie mise à jour' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Cette catégorie existe déjà' });
        }
        console.error('Erreur editCategory:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function removeCategory(req, res) {
    try {
        const category = await findCategoryById(req.params.id, req.householdId);
        if (!category) return res.status(404).json({ message: 'Catégorie introuvable' });

        const tasksCount = await countTasksUsingCategory(req.params.id, req.householdId);
        if (tasksCount > 0) {
            return res.status(409).json({
                message: `Cette catégorie est utilisée par ${tasksCount} tâche${tasksCount > 1 ? 's' : ''}, impossible de la supprimer`,
            });
        }

        await deleteCategoryRepo(req.params.id, req.householdId);
        res.json({ message: 'Catégorie supprimée' });
    } catch (error) {
        console.error('Erreur removeCategory:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}