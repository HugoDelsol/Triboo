// server/src/routes/tasks.routes.js
import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  removeTask,
} from '../controllers/tasks.controller.js';
import { createTaskRules, updateTaskRules, taskIdParamRule } from '../validators/tasks.validator.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/', getAllTasks);
router.get('/:id', taskIdParamRule, validate, getTaskById);
router.post('/', createTaskRules, validate, createTask);
router.put('/:id', updateTaskRules, validate, updateTask);
router.delete('/:id', taskIdParamRule, validate, removeTask);

export default router;