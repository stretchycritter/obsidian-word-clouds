import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import obsidianmd from 'eslint-plugin-obsidianmd';
import globals from 'globals';

export default defineConfig([
  // ── Global ignores ─────────────────────────────────────────────────────
  {
    ignores: ['src/**/__tests__/**', 'src/**/__benchmarks__/**', 'src/**/*.test.ts', 'src/**/*.spec.ts', 'src/**/*.bench.ts'],
  },

  ...obsidianmd.configs.recommended,

  // ── TypeScript source files: parser, type-aware project, merged rules ──
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json' },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'obsidianmd/sample-names': 'off',
      '@typescript-eslint/require-await': 'error',

      // Merge obsidianmd package restrictions with import-alias enforcement
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'axios', message: 'Use the built-in `requestUrl` function instead of `axios`.' },
            { name: 'superagent', message: 'Use the built-in `requestUrl` function instead of `superagent`.' },
            { name: 'got', message: 'Use the built-in `requestUrl` function instead of `got`.' },
            { name: 'ofetch', message: 'Use the built-in `requestUrl` function instead of `ofetch`.' },
            { name: 'ky', message: 'Use the built-in `requestUrl` function instead of `ky`.' },
            { name: 'node-fetch', message: 'Use the built-in `requestUrl` function instead of `node-fetch`.' },
            { name: 'moment', message: "The 'moment' package is bundled with Obsidian. Please import it from 'obsidian' instead." },
          ],
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

  // ── d3 sub-packages are re-exported from the `d3` dependency ───────────
  {
    files: ['src/core/renderers/**/*.ts'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },

  // ── Barrel-import boundaries (outside core/ui/i18n) ────────────────────
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

  // ── Ingestion layer boundaries ─────────────────────────────────────────
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

  // ── Pipeline layer boundaries ──────────────────────────────────────────
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
]);
