import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig(
  globalIgnores([
    './dist/*',
    './node_modules/*',
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  stylistic.configs.customize({
    quotes: 'single',
    semi: true,
    indent: 2,
    commaDangle: 'always-multiline',
  }),
  {
    rules: {
      '@stylistic/max-statements-per-line': ['error', { max: 1, ignoredNodes: ['BreakStatement', 'IfStatement', 'SwitchStatement', 'ThrowStatement'] }],
    },
  },
);
