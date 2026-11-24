import { app } from './app.js';
import { pgp } from './db.js';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '127.0.0.1';

app.listen(port, host, (error) => {
  if (error) {
    console.error('Не удалось запустить сервер:', error);
    pgp.end();
    process.exitCode = 1;
    return;
  }
  console.info(`API: http://${host}:${port}`);
});
