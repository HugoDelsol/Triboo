// server/src/routes/tasks.routes.js
import { Router } from 'express';
import { createRecurringTask } from '../controllers/recurringTasks.controller.js';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  removeTask,
} from '../controllers/tasks.controller.js';
import { createTaskRules, updateTaskRules, taskIdParamRule, createRecurringTaskRules } from '../validators/tasks.validator.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/', getAllTasks);
router.get('/:id', taskIdParamRule, validate, getTaskById);
router.post('/', createTaskRules, validate, createTask);
router.put('/:id', updateTaskRules, validate, updateTask);
router.delete('/:id', taskIdParamRule, validate, removeTask);

router.post('/recurring', createRecurringTaskRules, validate, createRecurringTask);

export default router;