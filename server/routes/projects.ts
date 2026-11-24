import { Router } from 'express';
import { createProject, deleteProject, getProject, listProjects, updateProject } from '../controllers/projects.js';

export const projectsRouter = Router();

projectsRouter.route('/').get(listProjects).post(createProject);
projectsRouter.route('/:projectId').get(getProject).put(updateProject).delete(deleteProject);
