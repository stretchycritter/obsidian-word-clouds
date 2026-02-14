# Development

## Prerequisites

- Node.js 20+
- Obsidian vault on your machine

## Install

```bash
npm install
```

## Configure local deploy target (one-time)

```bash
cp .deploy.local.example .deploy.local
```

Set `.deploy.local` to either:

- vault root (example: `/Users/you/Obsidian/MyVault`)
- plugin dir (example: `/Users/you/Obsidian/MyVault/.obsidian/plugins/word-clouds`)

## Run (watch mode)

```bash
npm run dev
```

## Build once

```bash
npm run build
```

## Local deploy

Uses `scripts/deploy.mjs` through `stage.sh`:

```bash
./stage.sh
```

Override target ad-hoc:

```bash
./stage.sh /absolute/path/to/vault-or-plugin-dir
```

Direct deploy command:

```bash
npm run deploy -- /absolute/path/to/vault-or-plugin-dir
```

## Debug in Obsidian

1. Deploy plugin (`./stage.sh`)
2. Enable/reload plugin in Obsidian
3. Open dev tools: `View -> Toggle developer tools`
4. Check console logs/errors while using plugin

## Files used for local deploy

- `stage.sh`: convenience wrapper for deploy target resolution
- `scripts/deploy.mjs`: build + copy `dist/manifest.json`, `dist/main.js`, `dist/styles.css`
- `.deploy.local`: local (git-ignored) default deploy target
- `.deploy.local.example`: template for `.deploy.local`
