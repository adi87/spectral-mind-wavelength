import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Get the base path from an environment variable, otherwise default to '/' for local
const BASE_PATH = process.env.VITE_BASE_PATH || '/';

console.log(`Building with Base Path: ${BASE_PATH}`);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      base: BASE_PATH,
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
