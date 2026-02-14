---
tags: [features, vault, analysis]
---

# Vault Word Cloud

The vault cloud aggregates tokens across many files to surface global vocabulary.

## Behavior

- Scans selected sources in the vault
- Aggregates token frequencies
- Applies filter and scale rules
- Renders weighted terms in an interactive view

## Usage flow

1. Open the vault cloud command
2. Adjust filters and excluded tags
3. Click a word to inspect context or continue searching

## Test ideas

- Confirm large vaults still produce consistent output
- Confirm excluded tags are respected
- Confirm repeated terms scale correctly

## Related notes

- [[Features/Tag Filters]]
- [[Features/Search Integration]]
- [[Testing/Test Plan]]
