// server/src/routes/categories.routes.js
import { Router } from 'express';
import {
    getAllCategories,
    createCategory,
    editCategory,
    removeCategory,
} from '../controllers/categories.controller.js';

const router = Router();

router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', editCategory);
router.delete('/:id', removeCategory);

export default router;