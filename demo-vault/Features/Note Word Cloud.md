---
tags: [features, note, analysis]
---

# Note Word Cloud

The note cloud focuses on the currently active note for local analysis.

## Behavior

- Reads text from the active file
- Builds token frequencies for that note
- Renders a cloud tuned for quick inspection

## Good use cases

- Review draft repetition
- Check topical focus before publishing
- Compare writing style between notes

## Test ideas

- Switch between notes quickly and verify refresh behavior
- Validate punctuation-heavy notes tokenize correctly
- Validate headings, bullets, and links process as expected

## Related notes

- [[Features/Vault Word Cloud]]
- [[Testing/Test Corpus]]
- [[Project/Architecture]]
