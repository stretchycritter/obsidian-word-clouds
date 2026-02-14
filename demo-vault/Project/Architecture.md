---
tags: [project, architecture, pipeline]
---

# Architecture

The plugin uses a staged pipeline so processing stays testable and predictable.

## Pipeline stages

1. Source selection
2. Tokenization
3. Filtering
4. Normalization
5. Aggregation
6. Scaling
7. Render model

Primary code lives under:

- `src/pipeline/stages/`
- `src/processing/`
- `src/rendering/`
- `src/views/`

## Main execution paths

- Vault cloud path: [[Features/Vault Word Cloud]]
- Note cloud path: [[Features/Note Word Cloud]]

## Stability notes

- Keep stage interfaces small and explicit
- Favor deterministic transforms for easier debugging
- Keep UI controls aligned with settings in `src/settings/`

## Related notes

- [[Project/Plugin Overview]]
- [[Testing/Test Plan]]
- [[Development/Release Checklist]]
