import express from 'express';
import { errorHandler, HttpError } from './errors.js';
import { projectsRouter } from './routes/projects.js';
import { tasksRouter } from './routes/tasks.js';
import helmet from 'helmet';

export const app = express();
app.use(helmet());
app.use(express.json());
app.use('/api/projects', projectsRouter);
app.use('/api/projects/:projectId/tasks', tasksRouter);

app.use((_req, _res, next) => {
  next(new HttpError(404, 'Маршрут не найден'));
});
app.use(errorHandler);
