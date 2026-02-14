---
tags: [project, overview, word-clouds]
---

# Plugin Overview

The **Word Clouds** plugin generates interactive word clouds from Obsidian notes.

## Goals

- Make theme and topic density visible at a glance
- Support both single-note and vault-wide analysis
- Keep controls fast and understandable

## Core concepts

- **Tokenization**: break note content into meaningful words
- **Normalization**: lowercase, clean punctuation, standardize forms
- **Filtering**: remove stop words, ignored terms, or excluded tags
- **Scaling**: map frequency to font size for visual weight
- **Rendering**: display cloud and enable selection interactions

See implementation details in [[Project/Architecture]].

## User-facing surfaces

- Vault view: [[Features/Vault Word Cloud]]
- Note view: [[Features/Note Word Cloud]]
- Filtering controls: [[Features/Tag Filters]]
- Search bridge: [[Features/Search Integration]]

## Documentation loop

This vault is both product docs and validation data. Update this note whenever behavior changes in `src/`.
