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

```wordcloud
id: 704353d6-e687-4d68-9a0e-b293f9f6c069
scope: file
size: medium
font-family: Arial, sans-serif
```

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

/word
### Note cloud: this home note

```wordcloud
id: 1e41e92a-8819-4e33-82d6-08b3b161ee64
data: eyJzY29wZSI6ImZpbGUiLCJzaXplIjoibWVkaXVtIiwibmxwLWVuYWJsZWQiOiJ0cnVlIn0=
```

### Note cloud: architecture note

```wordcloud
mode: specific-file
file: Project/Architecture.md
height: 280
```

### Note cloud: static (no controls, no pan/zoom)

```wordcloud
id: acf9a8a5-f1a3-4aaa-89fc-114f9b74215f
data: eyJzY29wZSI6ImZpbGUiLCJzaXplIjoibWVkaXVtIiwibmxwLWVuYWJsZWQiOiJ0cnVlIiwibmxwLWZpbHRlci1udW1lcmljLXRva2VucyI6ImZhbHNlIn0=
```

```wordcloud
scope: file
size: large
file: Features/Tag Filters.md
min-count: 1
max-count: 9999
```
Use this in any note to render a centered static cloud with no controls and no pan/zoom (`interactions` and `interactable` are both supported):

```wordcloud
scope: file
size: medium
file: Features/Vault Word Cloud.md
min-count: 1
max-count: 9999
```

### Example: frequency labels with count/frequency toggle

1. Open plugin settings and enable:
   - `Show value in word text`
   - `Word value mode: Frequency (%)`
   - `Show count/frequency toggle button`
2. Use this embed block:

```wordcloud
scope: vault
size: medium
min-count: 2
max-count: 9999
interactions: true
```

This renders inline frequencies (for example `word (4.f3%)`) and adds a `123`/`%` button in the cloud controls to switch between count and frequency.
