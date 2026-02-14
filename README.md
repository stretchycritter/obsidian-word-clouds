# Development

## Prerequisites

- Node.js 20+
- Obsidian vault on your machine

## Install

```bash
npm install
```

## Run (watch mode)

```bash
npm run dev
```

## Build once

```bash
npm run build
```

## Build + deploy to demo vault

```bash
npm run build:demo
```

## Deploy to demo vault (without rebuilding)

```bash
npm run deploy:demo
```

## Watch, rebuild, and redeploy

```bash
npm run watch:demo
```

Watches source changes, rebuilds via esbuild watch mode, and redeploys updated files to `demo-vault/.obsidian/plugins/<plugin-id>/`.

## Debug in Obsidian

1. Build and deploy plugin (`npm run build:demo`)
2. Enable/reload plugin in Obsidian
3. Open dev tools: `View -> Toggle developer tools`
4. Check console logs/errors while using plugin

## Files used for local deploy

- `scripts/deploy-demo.mjs`: copies `dist/manifest.json`, `dist/main.js`, `dist/styles.css` to `demo-vault/.obsidian/plugins/<plugin-id>/`
