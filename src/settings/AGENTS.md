# Settings Agent Rules

This file defines required sync rules for AI edits touching settings.

## Scope
- Applies to any change under `src/settings`, `src/ui/modals/edit-word-cloud-modal.ts`, and `src/ui/blocks/wordcloud-block.ts`.

## Required sync behavior
1. If a new setting is added to `WordCloudSettings`, `RenderSettings`, or filter/NLP settings:
- Add UI support in `src/ui/modals/edit-word-cloud-modal.ts` in the appropriate tab.
- Tab order must remain: `Filters` (default), `Display`, `Interactions`.

2. If a setting can be overridden per embedded cloud:
- Parse it from markdown in `src/ui/blocks/wordcloud-block.ts`.
- Pass it into collection/render flow so embed overrides are effective.
- Initialize modal state from effective values (global defaults + block overrides).

3. Markdown serialization rules from the modal:
- Persist per-cloud overrides when clicking Apply.
- Do not write keys whose value equals current app defaults.
- Keep existing block keys stable where possible for backward compatibility.

4. i18n requirements:
- Any user-facing text added for settings/modal must use `t(...)`.
- Add matching keys to `src/i18n/en.json`.

5. Regression checks after setting changes:
- Run `npm run typecheck`.
- Run `npm test`.
- Run `npm run lint`.

## Quick checklist for AI
- [ ] Added/updated setting type
- [ ] Added modal control
- [ ] Added parser support
- [ ] Added markdown write support (default-eliding)
- [ ] Added i18n keys
- [ ] Passed typecheck/tests/lint
