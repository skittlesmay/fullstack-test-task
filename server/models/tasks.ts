import { db } from '../db.js';

export interface TaskInput {
  title: string;
  due_date: string;
  estimated_hours: string;
  priority: number;
}

export interface Task extends TaskInput {
  id: number;
  project_id: number;
}

export function listByProject(projectId: number): Promise<Task[]> {
  return db.any<Task>('SELECT * FROM tasks WHERE project_id = $1 ORDER BY id', [projectId]);
}

export function findById(projectId: number, taskId: number): Promise<Task | null> {
  return db.oneOrNone<Task>('SELECT * FROM tasks WHERE project_id = $1 AND id = $2', [projectId, taskId]);
}

export function create(projectId: number, input: TaskInput): Promise<Task> {
  return db.one<Task>(
    'INSERT INTO tasks (project_id, title, due_date, estimated_hours, priority) VALUES (${projectId}, ${title}, ${due_date}, ${estimated_hours}, ${priority}) RETURNING *',
    { ...input, projectId },
  );
}

export function update(projectId: number, taskId: number, input: TaskInput): Promise<Task | null> {
  return db.oneOrNone<Task>(
    'UPDATE tasks SET title = ${title}, due_date = ${due_date}, estimated_hours = ${estimated_hours}, priority = ${priority} WHERE project_id = ${projectId} AND id = ${taskId} RETURNING *',
    { ...input, projectId, taskId },
  );
}

export function remove(projectId: number, taskId: number): Promise<{ id: number } | null> {
  return db.oneOrNone('DELETE FROM tasks WHERE project_id = $1 AND id = $2 RETURNING id', [projectId, taskId]);
}
