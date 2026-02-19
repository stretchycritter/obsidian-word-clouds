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
  {
    files: ['src/core/ingestion/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/core/pipeline', '@/core/pipeline/*', '@/core/application', '@/core/application/*'],
              message: 'Ingestion layer must not import pipeline or application.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/core/pipeline/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/core/ingestion', '@/core/ingestion/*', '@/core/application', '@/core/application/*'],
              message: 'Pipeline layer must not import ingestion or application.',
            },
          ],
        },
      ],
    },
  },
];
