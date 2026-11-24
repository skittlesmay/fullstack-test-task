import type { Request, Response } from 'express';
import { hasErrorCode, HttpError } from '../errors.js';
import * as projects from '../models/projects.js';
import { bodyObject, dateField, decimalField, integerField, integerParameter, textField } from '../validation.js';

function projectInput(value: unknown): projects.ProjectInput {
  const body = bodyObject(value);
  return {
    name: textField(body.name, 'name'),
    start_date: dateField(body.start_date, 'start_date'),
    budget: decimalField(body.budget, 'budget', 10),
    team_size: integerField(body.team_size, 'team_size'),
  };
}

export async function listProjects(req: Request, res: Response): Promise<void> {
  const offset = req.query.offset === undefined ? 0 : integerParameter(req.query.offset, 'offset', 0);
  const limit = req.query.limit === undefined ? 25 : integerParameter(req.query.limit, 'limit', 1, 100);
  res.json(await projects.list(offset, limit));
}

export async function getProject(req: Request, res: Response): Promise<void> {
  const id = integerParameter(req.params.projectId, 'projectId');
  const project = await projects.findById(id);
  if (!project) throw new HttpError(404, 'Проект не найден');
  res.json(project);
}

export async function createProject(req: Request, res: Response): Promise<void> {
  const project = await projects.create(projectInput(req.body));
  res.status(201).json(project);
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  const id = integerParameter(req.params.projectId, 'projectId');
  const project = await projects.update(id, projectInput(req.body));
  if (!project) throw new HttpError(404, 'Проект не найден');
  res.json(project);
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  const id = integerParameter(req.params.projectId, 'projectId');
  try {
    const project = await projects.remove(id);
    if (!project) throw new HttpError(404, 'Проект не найден');
  } catch (error) {
    if (hasErrorCode(error, '23503')) {
      throw new HttpError(409, 'Нельзя удалить проект, пока у него есть задачи');
    }
    throw error;
  }
  res.status(204).end();
}
