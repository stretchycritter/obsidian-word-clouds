---
tags: [word-clouds, plugin, index, docs]
---

# Word Clouds Plugin Home

This vault is the living documentation and test bed for the **Word Clouds** plugin.

## Start here

- [[Project/Plugin Overview]]
- [[Project/Architecture]]
- [[Features/Vault Word Cloud]]
- [[Features/Note Word Cloud]]
- [[Testing/Test Plan]]
- [[Development/Release Checklist]]

## Why this vault exists

- Document decisions and behavior of the plugin
- Stress test tokenization, filtering, scaling, and rendering
- Validate links, tags, and graph relationships in a realistic set of notes

## Feature map

- Vault-level analysis: [[Features/Vault Word Cloud]]
- Active-note analysis: [[Features/Note Word Cloud]]
- Tag-based exclusion and curation: [[Features/Tag Filters]]
- Search workflow integration: [[Features/Search Integration]]

## Related notes

- [[Project/Roadmap]]
- [[Testing/Test Corpus]]

## Embedded previews

Embedded blocks support three modes:
- `mode: current-file` uses the note that contains the embed.
- `mode: specific-file` uses a file path from `file:`.
- `mode: tag-based` scans vault files filtered by `tags:` and optional `match: any|all`.

### Note cloud: this home note

```wordcloud
mode: current-file
height: 780
interactions: true
```

### Note cloud: architecture note

```wordcloud
mode: specific-file
file: Project/Architecture.md
height: 280
```

### Note cloud: static (no controls, no pan/zoom)

```wordcloud
scope: file
size: large
```

```wordcloud
scope: vault
size: medium
exclude-words: test
```
Use this in any note to render a centered static cloud with no controls and no pan/zoom (`interactions` and `interactable` are both supported):

```wordcloud
mode: specific-file
file: Features/Vault Word Cloud.md
height: 300
interactions: false
```

