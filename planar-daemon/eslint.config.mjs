import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importX from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import { files, ignores, importSortRules } from '../eslint.shared.mjs';

export default defineConfig(
  globalIgnores([
    ...ignores,
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  stylistic.configs.customize({
    quotes: 'single',
    semi: true,
    indent: 2,
    commaDangle: 'always-multiline',
  }),
  {
    files,
    plugins: {
      'import-x': importX,
      'simple-import-sort': simpleImportSort,
    },
    rules: importSortRules,
  },
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_+$',
          varsIgnorePattern: '^_+$',
        },
      ],
    },
  },
);
