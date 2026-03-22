import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './src/swagger/swagger.json',
  logs: {
    path: './src/swagger/logs',
  },
  output: {
    path: './src/swagger/client',
    postProcess: ['eslint'],
  },
  plugins: [
    '@hey-api/client-axios',
    '@hey-api/schemas',
    '@hey-api/sdk',
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
  ],
});
