# Project Tracker

**Стек:** Node.js, Express, TypeScript, pg-promise, PostgreSQL, React, Vite, MUI, AG Grid, Docker.

## Запуск через Docker

```bash
cp .env.example .env
docker compose up --build -d
```

Приложение доступно на `http://localhost:8080` 

## Локальный запуск

Зависимости Node.js 24+ и PostgreSQL 17.

1. Скопируйте `.env.example` в `.env` и укажите пароль вашей роли PostgreSQL.

2. Создайте БД и загрузите данные:

```bash
psql -h 127.0.0.1 -U postgres -d postgres -v ON_ERROR_STOP=1 -f init-db.sql
```

3. Запустите сервер порт `3000`

```bash
cd server
npm ci
npm run dev
```

4. Запустите клиент `http://127.0.0.1:5173`

```bash
cd client
npm ci
npm run dev
```
