// server/src/routes/tasks.routes.js
import { Router } from 'express';
import { createRecurringTask, editTaskRecurring } from '../controllers/recurringTasks.controller.js';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  editTask,
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

router.post('/recurring', validate, createRecurringTask);
router.put('/editTaskRecurring/:id', validate, editTaskRecurring);
router.put('/editTask/:id', validate, editTask);

export default router;