import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
// import eslintImport from 'eslint-plugin-import'; // https://github.com/import-js/eslint-plugin-import/issues/3227

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
  // eslintImport.flatConfigs.recommended,
  // eslintImport.flatConfigs.typescript,
  {
    rules: {
      '@stylistic/max-statements-per-line': ['error', { max: 1, ignoredNodes: ['BreakStatement', 'IfStatement', 'SwitchStatement', 'ThrowStatement'] }],
      // 'sort-imports': ['error', {
      //   ignoreCase: true,
      //   ignoreDeclarationSort: false,
      //   ignoreMemberSort: false,
      //   memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      //   allowSeparatedGroups: false,
      // }],
      // 'import/no-unresolved': 'error',
      // 'import/order': [
      //   'error',
      //   {
      //     groups: [
      //       'builtin',
      //       'external',
      //       'internal',
      //       ['sibling', 'parent'],
      //       'index',
      //       'unknown',
      //     ],
      //     'newlines-between': 'always',
      //     alphabetize: {
      //       order: 'asc',
      //       caseInsensitive: true,
      //     },
      //   },
      // ],
    },
  },
);
