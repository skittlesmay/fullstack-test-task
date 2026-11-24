export interface Project {
  id: number;
  name: string;
  start_date: string;
  budget: string;
  team_size: number;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  due_date: string;
  estimated_hours: string;
  priority: number;
}

export type TaskInput = Omit<Task, 'id' | 'project_id'>;

export async function getProjects(offset: number, limit: number, signal: AbortSignal): Promise<{ rows: Project[]; total: number }> {
  const response = await fetch(`/api/projects?offset=${offset}&limit=${limit}`, { signal });
  if (!response.ok) throw new Error('Не удалось загрузить проекты');
  return response.json();
}

export async function getTasks(projectId: number, signal: AbortSignal): Promise<Task[]> {
  const response = await fetch(`/api/projects/${projectId}/tasks`, { signal });
  if (!response.ok) throw new Error('Не удалось загрузить задачи');
  return response.json();
}

async function responseError(response: Response, fallback: string): Promise<Error> {
  const body: unknown = await response.json().catch(() => null);
  const message = typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string'
    ? body.error
    : fallback;
  return new Error(message);
}

export async function createTask(projectId: number, input: TaskInput): Promise<Task> {
  const response = await fetch(`/api/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw await responseError(response, 'Не удалось добавить задачу');
  return response.json();
}

export async function updateTask(projectId: number, taskId: number, input: TaskInput): Promise<Task> {
  const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw await responseError(response, 'Не удалось изменить задачу');
  return response.json();
}

export async function deleteTask(projectId: number, taskId: number): Promise<void> {
  const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, { method: 'DELETE' });
  if (!response.ok) throw await responseError(response, 'Не удалось удалить задачу');
}
