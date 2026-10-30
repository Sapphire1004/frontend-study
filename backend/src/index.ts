import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

import { app } from './app.js';

const port = Number(process.env.PORT ?? '3000');

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT는 1~65535 사이의 정수여야 합니다.');
}

app.use('*', serveStatic({ root: './dist/frontend' }));
app.get('*', serveStatic({ path: './dist/frontend/index.html' }));

const server = serve(
  {
    fetch: app.fetch,
    hostname: '127.0.0.1',
    port,
  },
  (info) => {
    console.log(`Hono: http://127.0.0.1:${info.port}`);
  },
);

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    if ('closeAllConnections' in server) {
      server.closeAllConnections();
    }
  });
}
