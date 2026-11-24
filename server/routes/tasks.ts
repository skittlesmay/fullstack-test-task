import { Router } from 'express';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '../controllers/tasks.js';

export const tasksRouter = Router({ mergeParams: true });

tasksRouter.route('/').get(listTasks).post(createTask);
tasksRouter.route('/:taskId').get(getTask).put(updateTask).delete(deleteTask);
