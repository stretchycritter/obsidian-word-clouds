import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*', '../../*', '../../../*', '../../../../*', '../../../../../*'],
              message: 'Use the "@/..." alias for internal imports.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.ts'],
    ignores: ['src/core/**/*.ts', 'src/ui/**/*.ts', 'src/i18n/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/core/*'],
              message: 'Import from "@/core" instead of deep core internals.',
            },
            {
              group: ['@/ui/*'],
              message: 'Import from "@/ui" instead of deep ui internals.',
            },
            {
              group: ['@/i18n/*'],
              message: 'Import from "@/i18n" instead of deep i18n internals.',
            },
          ],
        },
      ],
    },
  },
];
