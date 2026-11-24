import type { ErrorRequestHandler } from 'express';

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === code;
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = Number(error.status);
    if (Number.isInteger(status) && status >= 400 && status < 500) {
      res.status(status).json({ error: status === 413 ? 'Слишком большой запрос' : 'Некорректный запрос' });
      return;
    }
  }

  console.error('Неожиданная ошибка запроса:', error);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
};
