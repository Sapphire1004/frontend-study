import { Hono } from 'hono';
import { logger } from 'hono/logger';

export const app = new Hono()
  .use(logger())
  .get('/api/health', (c) =>
    c.json({
      ok: true,
      message: 'Hono API 연결 성공',
    }),
  )
  .all('/api/*', (c) => c.json({ error: 'API route not found' }, 404));

export type AppType = typeof app;
