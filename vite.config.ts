import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const redirectBaseWithoutSlash = () => ({
  name: 'redirect-base-without-slash',
  configureServer(server: {
    middlewares: {
      use: (
        handler: (
          request: { url?: string },
          response: {
            statusCode: number;
            setHeader: (name: string, value: string) => void;
            end: () => void;
          },
          next: () => void,
        ) => void,
      ) => void;
    };
  }) {
    server.middlewares.use((request, response, next) => {
      if (request.url === '/WHYNE') {
        response.statusCode = 302;
        response.setHeader('Location', '/WHYNE/');
        response.end();
        return;
      }
      next();
    });
  },
});

export default defineConfig({
  base: '/WHYNE/',
  plugins: [redirectBaseWithoutSlash(), react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    globals: true,
  },
});
