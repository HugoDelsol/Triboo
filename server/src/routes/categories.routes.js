// server/src/routes/categories.routes.js
import { Router } from 'express';
import {
    getAllCategories,
    createCategory,
    editCategory,
    removeCategory,
} from '../controllers/categories.controller.js';
import { createCategoryRules, editCategoryRules, categoryIdParamRule } from '../validators/categories.validator.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/', getAllCategories);
router.post('/', createCategoryRules, validate, createCategory);
router.put('/:id', editCategoryRules, validate, editCategory);
router.delete('/:id', categoryIdParamRule, validate, removeCategory);

export default router;