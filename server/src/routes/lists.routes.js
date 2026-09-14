// server/src/routes/lists.routes.js
import { Router } from 'express';
import {
    getAllLists,
    getListById,
    createList,
    removeList,
    createListItem,
    editListItem,
    removeListItem,
} from '../controllers/lists.controller.js';

const router = Router();

router.get('/', getAllLists);
router.get('/:id', getListById);
router.post('/', createList);
router.delete('/:id', removeList);

router.post('/:listId/items', createListItem);
router.put('/:listId/items/:itemId', editListItem);
router.delete('/:listId/items/:itemId', removeListItem);

export default router;