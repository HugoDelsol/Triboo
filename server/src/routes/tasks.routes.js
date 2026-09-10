// server/src/routes/tasks.routes.js
import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  removeTask,
} from '../controllers/tasks.controller.js';

const router = Router();

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', removeTask);

export default router;