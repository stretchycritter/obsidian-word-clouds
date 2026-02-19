# Run options
- Dev build (one-off): `npm run build:dev`
- Release build (includes typecheck): `npm run build:release`
- Tests: `npm test` | coverage: `npm run test:coverage`
- Lint: `npm run lint`
- Typecheck only: `npm run typecheck`
- Benchmarks: `npm run benchmark` (or `benchmark:small|medium|large|custom`)

# Imports
1. All imports must use the base @/
2. No file, except for index.ts barrel files, should export an import to fix paths
3. Any import from outside of a folder with a barrel file, must import using the barrel file

# Where things are
The files in the /src root are lifecycle logic for the project
The /core folder contains all of the logic behind generating word clouds
The /UI folder contains all blocks, visual components, modals, and views
The /settings folder contains settings, validators, constants and types
The /commands folder contains all commands

# Translation usage

Use the shared i18n helper for any user-facing text.

1. Add a key/value entry in `src/i18n/en.json`.
2. Import `t` from `@/i18n`.
3. Replace hardcoded UI strings with `t("your.translation.key")`.

Example:

```ts
import { t } from '@/i18n';

button.setButtonText(t('commands.openVaultWordCloud'));
```
