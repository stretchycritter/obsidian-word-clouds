# Obsidian Word Clouds

Embed interactive word clouds directly into your Obsidian notes. Desktop and mobile.

<img src="./.assets/example-word-cloud.png" alt="Word Cloud Example" width="600">

---

## Insert a Word Cloud

Open the command palette (`Ctrl/Cmd+P`) and type **Word Clouds: Insert Word Cloud** — or just start with `word` to bring it to the top.

A configuration modal opens where you pick a scope and hit **Insert**:

- **File** — words from the current note (default)
- **Vault** — words from every note
- **Folder** — words from a specific folder

That's it. Your word cloud renders inline.

---

## Customize Any Word Cloud

Every embedded word cloud can override your default settings. Click the edit button on any cloud to open its editor with three tabs:

- **Filters** — scope, include/exclude tags, frontmatter rules, frequency thresholds, per-cloud word exclusions
- **Layout** — font, rotation, scaling mode, size preset, word padding, font size range
- **Interactions** — pan/zoom, click-to-search, controls overlay, export buttons

You can also right-click any word to exclude it from that specific cloud or from all clouds vault-wide.

---

## Built-in NLP

Word clouds are only useful when similar words are grouped together. The plugin includes lightweight Natural Language Processing that runs automatically:

- **Light mode** (default) — collapses common suffixes so "running", "runs", and "run" count as one word
- **Aggressive mode** — deeper normalization for suffixes like `-tion`, `-ment`, `-ly`
- Preserves acronyms (API, NASA stay intact)
- Filters out numbers
- Minimum word length threshold (default 3 characters)

The result is cleaner clouds that surface real themes instead of noise. NLP settings can be adjusted globally or per-cloud.

---

## Interact and Export

- Pan and zoom with your mouse
- Click any word to search your vault for it
- Toggle between word count and frequency labels
- Export to **PNG**, **SVG**, or **JPEG** (desktop only)

---

## Privacy

- No web requests
- No telemetry
- Runs entirely on-device
- Your vault stays private

---

## Installation

1. Open **Settings → Community Plugins**
2. Browse for **Word Clouds**
3. Install and enable

---

## Feedback

[Suggest a feature](https://github.com/stretchycritter/obsidian-word-clouds/issues/new?template=feature_request.yml) · [Report a bug](https://github.com/stretchycritter/obsidian-word-clouds/issues/new?template=bug_report.yml)

---

## Development

See [`DEV.md`](./DEV.md)
