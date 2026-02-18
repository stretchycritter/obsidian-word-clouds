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
