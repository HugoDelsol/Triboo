// server/src/controllers/lists.controller.js
import {
    findAllLists,
    findListById,
    insertList,
    deleteList as deleteListRepo,
    findItemsByListId,
    insertListItem,
    updateListItem,
    deleteListItem as deleteListItemRepo,
} from '../repositories/list.repository.js';
import { findCategoryById } from '../repositories/category.repository.js';

export async function getAllLists(req, res) {
    try {
        const lists = await findAllLists(req.householdId);
        res.json(lists);
    } catch (error) {
        console.error('Erreur getAllLists:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function getListById(req, res) {
    try {
        const list = await findListById(req.params.id, req.householdId);
        if (!list) return res.status(404).json({ message: 'Liste introuvable' });

        const items = await findItemsByListId(list.id);
        res.json({ ...list, items });
    } catch (error) {
        console.error('Erreur getListById:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function createList(req, res) {
    const { title, category_id } = req.body;

    if (!title?.trim()) {
        return res.status(400).json({ message: 'Le titre de la liste est requis' });
    }
    if (category_id) {
        const category = await findCategoryById(category_id, req.householdId);
        if (!category) return res.status(400).json({ message: 'Catégorie invalide' });
    }

    try {
        const id = await insertList(req.householdId, req.session.profileId, title.trim(), category_id ?? null);
        res.status(201).json({ id, title: title.trim(), category_id: category_id ?? null });
    } catch (error) {
        console.error('Erreur createList:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function removeList(req, res) {
    try {
        const deleted = await deleteListRepo(req.params.id, req.householdId);
        if (!deleted) return res.status(404).json({ message: 'Liste introuvable' });
        res.json({ message: 'Liste supprimée' });
    } catch (error) {
        console.error('Erreur removeList:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function createListItem(req, res) {
    const { label } = req.body;
    if (!label?.trim()) {
        return res.status(400).json({ message: "Le nom de l'article est requis" });
    }

    try {
        const list = await findListById(req.params.listId, req.householdId);
        if (!list) return res.status(404).json({ message: 'Liste introuvable' });

        const id = await insertListItem(list.id, label.trim());
        res.status(201).json({ id, label: label.trim(), is_checked: false });
    } catch (error) {
        console.error('Erreur createListItem:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function editListItem(req, res) {
    try {
        const list = await findListById(req.params.listId, req.householdId);
        if (!list) return res.status(404).json({ message: 'Liste introuvable' });

        const updated = await updateListItem(req.params.itemId, list.id, req.body.is_checked);
        if (!updated) return res.status(404).json({ message: 'Article introuvable' });
        res.json({ message: 'Article mis à jour' });
    } catch (error) {
        console.error('Erreur editListItem:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function removeListItem(req, res) {
    try {
        const list = await findListById(req.params.listId, req.householdId);
        if (!list) return res.status(404).json({ message: 'Liste introuvable' });

        const deleted = await deleteListItemRepo(req.params.itemId, list.id);
        if (!deleted) return res.status(404).json({ message: 'Article introuvable' });
        res.json({ message: 'Article supprimé' });
    } catch (error) {
        console.error('Erreur removeListItem:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}