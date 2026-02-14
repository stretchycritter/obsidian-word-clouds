---
tags: [testing, qa, validation]
---

# Test Plan

This plan validates both plugin behavior and documentation quality in this vault.

## Functional checks

- Vault cloud renders from multi-note corpus
- Note cloud updates when active note changes
- Tag exclusions remove expected content
- Search action triggers and updates correctly

## Data checks

- Use linked notes in [[Testing/Test Corpus]]
- Confirm repeated domain words have higher weight
- Confirm rare words remain visible but smaller

## Documentation checks

- All main notes are reachable from [[00 - Word Clouds Plugin Home]]
- Links resolve without broken references
- Tags are present for graph and filter experiments

## Regression loop

When code changes land, rerun this checklist and record outcomes in release prep.

## Related notes

- [[Development/Release Checklist]]
- [[Project/Architecture]]
