import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/vitest/setupFile.js'],
    environmentOptions: {
      NODE_ENV: 'test',
    },
  },
});
