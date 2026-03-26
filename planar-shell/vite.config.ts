import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';

import type { UserConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  return {
    base: '/', // mode === 'production' ? '/' : '/',
    plugins: [
      react(),
      svgr({
        include: '**/*.svg',
      }),
    ],
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
      preprocessorOptions: {
        scss: {
          // additionalData: `@use "@/styles/variables.scss" as *;`
        },
      },
    },
    resolve: {
      tsconfigPaths: true,
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      open: true,
      hmr: {
        overlay: true,
      },
    },
    optimizeDeps: {
      include: ['planar-shared'],
      esbuildOptions: {
        format: 'esm',
      },
    },
  };
});
