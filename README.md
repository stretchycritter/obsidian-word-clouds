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

## Watch

```bash
npm run build:watch:dev
```

## Pipeline benchmark

Runs the pipeline benchmark against markdown files in `.temp/test-data/benchmark-vault` and writes output to `.temp/benchmarks/pipeline-results.md`.
The `benchmark` script seeds fresh benchmark data automatically before each run.
Each benchmark run is also persisted as a timestamped JSON file in `.temp/benchmarks/runs/<epoch>.json`.

```bash
npm run benchmark
```

You can pass run settings as npm parameters:

```bash
npm run benchmark -- --runs=25 --warmups=5 --repeat=10
```

- `--runs`: measured benchmark iterations (default: `10`)
- `--warmups`: warmup iterations before measuring (default: `3`)
- `--repeat`: duplicates loaded vault documents to scale test size (default: `1`)
- `--history`: averaging window for history summary in `pipeline-results.md` (default: `5`)

Run by profile:

```bash
npm run benchmark:small
npm run benchmark:medium
npm run benchmark:large
```

Run with custom small/medium/large counts:

```bash
npm run benchmark:custom -- --small-count=100 --medium-count=50 --large-count=25
```

Custom counts with a 20-run rolling average window:

```bash
npm run benchmark:custom -- --small-count=100 --medium-count=50 --large-count=25 --history=20
```

Environment fallback (still supported):

- `PIPELINE_BENCH_RUNS`
- `PIPELINE_BENCH_WARMUPS`
- `PIPELINE_BENCH_REPEAT`
- `PIPELINE_BENCH_VAULT`
- `PIPELINE_BENCH_OUTPUT`

## Generate benchmark test data files

Generate randomized small/medium/large markdown notes in `.temp/test-data/benchmark-vault`.
The target output directory is fully cleared on every run.

From the project root:

```bash
npm run benchmark:seed
```

## Clean `.temp` artifacts

```bash
npm run clean:temp
```

From the project root (fully parameterized):

```bash
node scripts/generate-test-data.mjs --small-count=100 --medium-count=50 --large-count=25
```

Common parameters:

- `--small-count`, `--medium-count`, `--large-count`: number of documents per default profile
- `--only-profile=small|medium|large`: generate only selected default profile(s)
- `--profile=label:count:min:max`: define custom profiles (repeatable; replaces defaults when used)
- `--output-dir=PATH`: change output location
- `--file-prefix=PREFIX`: change generated filename prefix
- `--paragraph-min`, `--paragraph-max`, `--intro-min`, `--intro-max`, `--closing-min`, `--closing-max`
- `--config=PATH`: JSON config file for full customization

Help:

```bash
node scripts/generate-test-data.mjs --help
```

## Try it in the demo vault

1. Open `demo-vault` as a vault in Obsidian.
2. For every change you need to disable and re-enable the plugin
