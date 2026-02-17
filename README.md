# Obsidian Word Clouds Plugin

## Features

- **Vault word cloud**: Generate a cloud from words across your vault.
- **Document word cloud**: Generate a cloud for a single note (current/open note workflows).
- **Embedded word clouds in notes**: Insert a `wordcloud` code block directly into a document.

## Commands

- `Open vault word cloud`
- `Open current note word cloud`
- `Embed word cloud in document`

## Build

```bash
npm install
npm run build:dev
```

## Release build (minified)

```bash
npm run build:release
```

## Community release process

1. Run the GitHub Action manually: `Actions -> Release -> Run workflow`.
2. Select `bump` as `patch`, `minor`, or `major`.
3. The workflow automatically:
   - builds the plugin
   - runs unit tests
   - bumps `manifest.json`, `package.json`, `package-lock.json`, and `versions.json`
   - commits and pushes the bump commit to the selected branch
   - creates and pushes the corresponding tag (`vX.Y.Z`)
   - packages and validates release artifacts
   - publishes the GitHub Release

The release workflow validates the version/tag match and publishes:

- `manifest.json`
- `main.js`
- `styles.css`

## Watch (auto rebuild + deploy to demo vault)

```bash
npm run watch:demo
```

## Try it in the demo vault

1. Open `demo-vault` as a vault in Obsidian.
2. For every change you need to disable and re-enable the plugin
