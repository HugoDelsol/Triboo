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
import { validate } from '../middlewares/validate.js';
import { createListRules, listIdParamRule, createListItemRules, editListItemRules, listItemParamsRule } from '../validators/lists.validator.js';

const router = Router();

router.get('/', getAllLists);
router.get('/:id', listIdParamRule, validate, getListById);
router.post('/', createListRules, validate, createList);
router.delete('/:id', listIdParamRule, validate, removeList);

router.post('/:listId/items', createListItemRules, validate, createListItem);
router.put('/:listId/items/:itemId', editListItemRules, validate, editListItem);
router.delete('/:listId/items/:itemId', listItemParamsRule, validate, removeListItem);

export default router;