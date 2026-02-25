module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier'
    ],
    ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'prettier'],
    rules: {
        'prettier/prettier': 'error'
    }
}
