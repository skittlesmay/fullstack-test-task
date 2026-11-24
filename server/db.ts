import pgPromise from 'pg-promise';

export const pgp = pgPromise();
const pg = pgp.pg;
pg.types.setTypeParser(1082, (val) => val);

export const db = pgp({
  host: process.env.PGHOST ?? '127.0.0.1',
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE ?? 'project_tracker',
  user: process.env.PGUSER ?? process.env.POSTGRES_USER ?? 'postgres',
  password: process.env.PGPASSWORD ?? process.env.POSTGRES_PASSWORD,
  connectionTimeoutMillis: 5000,
});
