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

## Pipeline benchmark (demo vault)

Runs the pipeline benchmark against markdown files in `demo-vault` and writes output to `benchmark-results.txt` in the project root.

```bash
npm run bench:pipeline
```

You can pass run settings as npm parameters:

```bash
npm run bench:pipeline --runs=25 --warmups=5 --repeat=10
```

- `--runs`: measured benchmark iterations (default: `10`)
- `--warmups`: warmup iterations before measuring (default: `3`)
- `--repeat`: duplicates loaded vault documents to scale test size (default: `1`)

Environment fallback (still supported):

- `PIPELINE_BENCH_RUNS`
- `PIPELINE_BENCH_WARMUPS`
- `PIPELINE_BENCH_REPEAT`
- `PIPELINE_BENCH_VAULT`

## Generate load-testing notes

Generate randomized small/medium/large markdown notes in `demo-vault/load-testing`.
The target output directory is fully cleared on every run.

From the project root:

```bash
npm run generate:load-test-vault
```

From the `scripts` folder (fully parameterized):

```bash
cd scripts
node generate-load-testing-vault.mjs --small-count=100 --medium-count=50 --large-count=25
```

Common parameters:

- `--small-count`, `--medium-count`, `--large-count`: number of documents per default profile
- `--profile=label:count:min:max`: define custom profiles (repeatable; replaces defaults when used)
- `--output-dir=PATH`: change output location
- `--file-prefix=PREFIX`: change generated filename prefix
- `--paragraph-min`, `--paragraph-max`, `--intro-min`, `--intro-max`, `--closing-min`, `--closing-max`
- `--config=PATH`: JSON config file for full customization

Help:

```bash
cd scripts
node generate-load-testing-vault.mjs --help
```

## Try it in the demo vault

1. Open `demo-vault` as a vault in Obsidian.
2. For every change you need to disable and re-enable the plugin
