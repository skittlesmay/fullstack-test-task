SET client_encoding = 'UTF8';
\set ON_ERROR_STOP on

CREATE DATABASE project_tracker ENCODING 'UTF8';
\c project_tracker

SET client_encoding = 'UTF8';

BEGIN;

CREATE TABLE projects (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    start_date DATE NOT NULL,
    budget NUMERIC(12,2) NOT NULL CHECK (budget >= 0),
    team_size INTEGER NOT NULL CHECK (team_size >= 0)
);

CREATE TABLE tasks (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    title VARCHAR(120) NOT NULL,
    due_date DATE NOT NULL,
    estimated_hours NUMERIC(8,2) NOT NULL CHECK (estimated_hours >= 0),
    priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 3)
);

CREATE INDEX tasks_project_id_idx ON tasks (project_id);

INSERT INTO projects (name, start_date, budget, team_size) VALUES
    ('Редизайн сайта компании', '2025-10-06', 420000.00, 4),
    ('Интернет-магазин автозапчастей', '2025-11-12', 950000.00, 6),
    ('Складской учёт', '2025-12-01', 680000.00, 5),
    ('Телеграм-бот поддержки', '2026-01-19', 180000.00, 2),
    ('Переезд на PostgreSQL 17', '2026-02-02', 250000.00, 3),
    ('Личный кабинет клиента', '2026-02-16', 740000.00, 5),
    ('Интеграция со службой доставки', '2026-03-04', 390000.00, 3),
    ('Отчёты по продажам', '2026-03-23', 510000.00, 4);

INSERT INTO tasks (project_id, title, due_date, estimated_hours, priority) VALUES
    (1, 'Собрать прототип главной страницы', '2025-10-14', 12.00, 1),
    (1, 'Сверстать адаптивную шапку и меню', '2025-10-21', 8.50, 2),
    (1, 'Подключить форму обратной связи', '2025-10-28', 6.00, 2),
    (1, 'Оптимизировать изображения на лендинге', '2025-11-04', 4.50, 3),
    (1, 'Выложить обновление на прод', '2025-11-10', 3.00, 1),

    (2, 'Сделать поиск по артикулу и VIN', '2025-11-25', 16.00, 1),
    (2, 'Настроить корзину и пересчёт скидок', '2025-12-03', 14.00, 1),
    (2, 'Подключить онлайн-оплату', '2025-12-12', 18.50, 1),
    (2, 'Добавить выгрузку заказов в 1С', '2025-12-22', 12.00, 2),

    (3, 'Проверить сканирование штрихкодов', '2025-12-11', 10.00, 1),
    (3, 'Вывести остатки по ячейкам хранения', '2025-12-19', 14.50, 2),
    (3, 'Настроить печать этикеток', '2025-12-26', 6.00, 3),

    (4, 'Настроить приём заявок и пересылку оператору', '2026-01-29', 9.00, 1),

    (6, 'Сверстать страницу истории заказов', '2026-02-26', 10.00, 2),
    (6, 'Добавить скачивание счетов и актов в PDF', '2026-03-05', 12.50, 1),
    (6, 'Реализовать восстановление пароля по почте', '2026-03-11', 6.50, 1),
    (6, 'Сделать редактирование реквизитов', '2026-03-17', 8.00, 2),
    (6, 'Подключить уведомления о смене статуса', '2026-03-24', 9.50, 2),
    (6, 'Проверить отображение на мобильных экранах', '2026-03-30', 5.00, 3),

    (7, 'Реализовать расчёт стоимости доставки', '2026-03-13', 11.00, 1),
    (7, 'Сохранять трек-номер в карточке заказа', '2026-03-20', 5.50, 2),
    (7, 'Добавить выбор пункта выдачи на карте', '2026-03-27', 14.00, 2),

    (8, 'Добавить фильтр отчёта по периоду', '2026-04-02', 6.00, 2),
    (8, 'Настроить выгрузку таблицы в Excel', '2026-04-09', 10.50, 1),
    (8, 'Собрать сводку по менеджерам', '2026-04-16', 8.00, 2),
    (8, 'Ограничить доступ к отчётам по ролям', '2026-04-22', 7.50, 1);

INSERT INTO projects (name, start_date, budget, team_size)
SELECT
    'Проект #' || i,
    DATE '2025-06-01' + (i * 7),
    (150000 + (i % 9) * 75000)::numeric(12,2),
    2 + (i % 6)
FROM generate_series(9, 55) AS i;

INSERT INTO tasks (project_id, title, due_date, estimated_hours, priority)
SELECT
    p.id,
    'Задача ' || n || ' (' || p.name || ')',
    p.start_date + (n * 5),
    (4 + ((p.id + n) % 12))::numeric(8,2),
    1 + ((p.id + n) % 3)
FROM projects p
JOIN generate_series(1, 3) AS n ON n <= (p.id % 4)
WHERE p.id >= 9
ORDER BY p.id, n;

COMMIT;
