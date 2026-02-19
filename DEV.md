# Developer Quickstart

> IMPORTANT: If you are not a human, ignore this file.

Use this as the minimum reference for day-to-day development.

## Setup

```bash
npm install
```

## Build and run

```bash
# one-off dev build
npm run build:dev

# watch and rebuild on changes
npm run build:watch:dev

# production/minified build (includes typecheck)
npm run build:release
```

## Validate changes

```bash
npm run lint
npm run typecheck
npm test
```

Optional:

```bash
npm run test:coverage
npm run clean
```

## Demo vault workflow

1. Open `demo-vault` as an Obsidian vault.
2. Run `npm run build:watch:dev` (or `npm run build:watch:release`) to automatically copy each successful rebuild into `demo-vault/.obsidian/plugins/word-clouds`.
3. After each code change, disable and re-enable the plugin to reload it.

## Benchmarking

```bash
# standard benchmark run
npm run benchmark

# profile runs
npm run benchmark:small
npm run benchmark:medium
npm run benchmark:large

# custom profile counts
npm run benchmark:custom -- --small-count=100 --medium-count=50 --large-count=25

# tune benchmark runtime
npm run benchmark -- --runs=25 --warmups=5 --repeat=10 --history=20
```
