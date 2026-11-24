import { HttpError } from './errors.js';

export function bodyObject(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new HttpError(400, 'Тело запроса должно быть JSON-объектом');
  }
  return value as Record<string, unknown>;
}

export function integerParameter(value: unknown, name: string, min = 1, max = 2147483647): number {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new HttpError(400, `Параметр ${name} должен быть целым числом`);
  }
  const result = Number(value);
  if (!Number.isInteger(result) || result < min || result > max) {
    throw new HttpError(400, `Параметр ${name} должен быть от ${min} до ${max}`);
  }
  return result;
}

export function textField(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.includes('\0')) {
    throw new HttpError(400, `Поле ${name} должно быть непустой строкой до 120 символов`);
  }
  const trimmed = value.trim();
  const length = Array.from(trimmed).length;
  if (!trimmed || length > 120) {
    throw new HttpError(400, `Поле ${name} должно содержать от 1 до 120 символов`);
  }
  return trimmed;
}

export function dateField(value: unknown, name: string): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) {
    throw new HttpError(400, `Поле ${name} должно быть корректной датой в формате YYYY-MM-DD`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new HttpError(400, `Поле ${name} должно быть корректной датой в формате YYYY-MM-DD`);
  }
  return value;
}

export function decimalField(value: unknown, name: string, integerDigits: number): string {
  const raw = typeof value === 'number' && Number.isFinite(value)
    ? String(value)
    : typeof value === 'string'
      ? value.trim()
      : null;
  if (raw === null || !new RegExp(`^\\d{1,${integerDigits}}(?:\\.\\d{1,2})?$`).test(raw)) {
    throw new HttpError(400, `Поле ${name} должно быть неотрицательным числом (до 2 знаков после точки)`);
  }
  return raw;
}

export function integerField(value: unknown, name: string, min = 0, max = 2147483647): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    throw new HttpError(400, `Поле ${name} должно быть целым числом от ${min} до ${max}`);
  }
  return value;
}
