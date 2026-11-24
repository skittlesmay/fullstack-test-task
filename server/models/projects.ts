import { db } from '../db.js';

export interface ProjectInput {
  name: string;
  start_date: string;
  budget: string;
  team_size: number;
}

export interface Project extends ProjectInput {
  id: number;
}

export async function list(offset: number, limit: number): Promise<{ rows: Project[]; total: number }> {
  const rows = await db.any<Project>('SELECT * FROM projects ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
  const { total } = await db.one<{ total: number }>('SELECT count(*)::integer AS total FROM projects');
  return { rows, total };
}

export function findById(id: number): Promise<Project | null> {
  return db.oneOrNone<Project>('SELECT * FROM projects WHERE id = $1', [id]);
}

export function create(input: ProjectInput): Promise<Project> {
  return db.one<Project>(
    'INSERT INTO projects (name, start_date, budget, team_size) VALUES (${name}, ${start_date}, ${budget}, ${team_size}) RETURNING *',
    input,
  );
}

export function update(id: number, input: ProjectInput): Promise<Project | null> {
  return db.oneOrNone<Project>(
    'UPDATE projects SET name = ${name}, start_date = ${start_date}, budget = ${budget}, team_size = ${team_size} WHERE id = ${id} RETURNING *',
    { ...input, id },
  );
}

export function remove(id: number): Promise<{ id: number } | null> {
  return db.oneOrNone('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
}
