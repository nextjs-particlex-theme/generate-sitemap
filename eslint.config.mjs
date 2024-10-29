
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ],
  files: ['**/*.ts', '**/*.mjs'],
  ignores: ['dest/', '.rollup.cache/*'],
  rules: {
    'quotes': ['error', 'single'],
    'key-spacing': ['error', { 'beforeColon': false }],
    'semi': [2, 'never'],
    'block-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    'indent': ['error', 2],
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/no-unused-vars': ['error', {
      'args': 'all',
      'argsIgnorePattern': '^_',
      'caughtErrors': 'all',
      'caughtErrorsIgnorePattern': '^_',
      'destructuredArrayIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'ignoreRestSiblings': true
    }]
  }
}
)