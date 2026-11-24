import type { Request, Response } from 'express';
import { hasErrorCode, HttpError } from '../errors.js';
import * as projects from '../models/projects.js';
import * as tasks from '../models/tasks.js';
import { bodyObject, dateField, decimalField, integerField, integerParameter, textField } from '../validation.js';

function taskInput(value: unknown): tasks.TaskInput {
  const body = bodyObject(value);
  return {
    title: textField(body.title, 'title'),
    due_date: dateField(body.due_date, 'due_date'),
    estimated_hours: decimalField(body.estimated_hours, 'estimated_hours', 6),
    priority: integerField(body.priority, 'priority', 1, 3),
  };
}

export async function listTasks(req: Request, res: Response): Promise<void> {
  const projectId = integerParameter(req.params.projectId, 'projectId');
  const project = await projects.findById(projectId);
  if (!project) throw new HttpError(404, 'Проект не найден');
  res.json(await tasks.listByProject(projectId));
}

export async function getTask(req: Request, res: Response): Promise<void> {
  const projectId = integerParameter(req.params.projectId, 'projectId');
  const taskId = integerParameter(req.params.taskId, 'taskId');
  const task = await tasks.findById(projectId, taskId);
  if (!task) throw new HttpError(404, 'Задача не найдена в выбранном проекте');
  res.json(task);
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const projectId = integerParameter(req.params.projectId, 'projectId');
  const input = taskInput(req.body);
  try {
    res.status(201).json(await tasks.create(projectId, input));
  } catch (error) {
    if (hasErrorCode(error, '23503')) throw new HttpError(404, 'Проект не найден');
    throw error;
  }
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const projectId = integerParameter(req.params.projectId, 'projectId');
  const taskId = integerParameter(req.params.taskId, 'taskId');
  const task = await tasks.update(projectId, taskId, taskInput(req.body));
  if (!task) throw new HttpError(404, 'Задача не найдена в выбранном проекте');
  res.json(task);
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const projectId = integerParameter(req.params.projectId, 'projectId');
  const taskId = integerParameter(req.params.taskId, 'taskId');
  const task = await tasks.remove(projectId, taskId);
  if (!task) throw new HttpError(404, 'Задача не найдена в выбранном проекте');
  res.status(204).end();
}
