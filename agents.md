# Imports
1. All imports must use the base @/
2. No file, except for index.ts barrel files, should export an import to fix paths
3. Any import from outside of a folder with a barrel file, must import using the barrel file

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