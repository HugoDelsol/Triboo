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
import { createTaskRules, updateTaskRules, taskIdParamRule, createRecurringTaskRules, editTaskDetailsRules, editTaskRecurringRules } from '../validators/tasks.validator.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/', getAllTasks);
router.get('/:id', taskIdParamRule, validate, getTaskById);
router.post('/', createTaskRules, validate, createTask);
router.put('/:id', updateTaskRules, validate, updateTask);
router.delete('/:id', taskIdParamRule, validate, removeTask);

router.post('/recurring', createRecurringTaskRules, validate, createRecurringTask);
router.put('/editTask/:id', editTaskDetailsRules, validate, editTask);
router.put('/editTaskRecurring/:id', editTaskRecurringRules, validate, editTaskRecurring);

export default router;