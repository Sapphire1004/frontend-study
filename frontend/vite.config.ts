import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const frontendRoot = fileURLToPath(new URL('.', import.meta.url));
const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, workspaceRoot, '');
  const apiPort = process.env.PORT ?? env.PORT ?? '3000';

  return {
    root: frontendRoot,
    envDir: workspaceRoot,
    plugins: [react(), tailwindcss()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      proxy: {
        '/api': `http://127.0.0.1:${apiPort}`,
      },
    },
    build: {
      outDir: fileURLToPath(new URL('../dist/frontend', import.meta.url)),
      emptyOutDir: true,
    },
  };
});
