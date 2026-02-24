# Obsidian Word Cloud Plugin — Detailed Review Report

**Date:** 2026-02-23
**Reviewers:** Architect 1 (Architecture & Design), Architect 2 (Infrastructure & Build), Code Reviewer 1 (Core & Services), Code Reviewer 2 (UI, Commands & Settings)
**Repository:** obsidian-wordcloud-plugin
**Version reviewed:** 0.2.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architect 1: Architecture & Design Analysis](#2-architect-1-architecture--design-analysis)
3. [Architect 2: Infrastructure & Build Analysis](#3-architect-2-infrastructure--build-analysis)
4. [Code Reviewer 1: Core & Services Quality](#4-code-reviewer-1-core--services-quality)
5. [Code Reviewer 2: UI, Commands & Settings Quality](#5-code-reviewer-2-ui-commands--settings-quality)
6. [Consolidated Priority Matrix](#6-consolidated-priority-matrix)

---

## 1. Executive Summary

The Obsidian Word Cloud plugin is a well-engineered piece of software that demonstrates clear architectural intent, strong TypeScript discipline, and thoughtful Obsidian API usage. The overall quality is high relative to the ecosystem. Several genuinely sophisticated choices stand out: the min-heap word selection, the generator-based streaming tokenizer, the nonce-based async render cancellation, and the settings serialization queue.

The findings below are not a condemnation — they are the expected surface area of a project at the v0.2 stage that has accumulated organic complexity. The most important issues cluster around three themes:

- **Dead code in the production path** — two pipeline stages are bypassed in the actual execution path, and an entire events infrastructure layer is an empty stub.
- **Promise and resource management** — several async paths can hang or leak object URLs if they fail.
- **Pre-release blockers** — `manifest.json` contains a placeholder `authorUrl` and developer TODO notes appear in the demo vault's README.

---

## 2. Architect 1: Architecture & Design Analysis

### 2.1 Overall Architecture

The plugin uses a clean three-tier layered architecture:

```
UI Layer        src/ui/           Views, modals, blocks, filter components
Service Layer   src/services/     Application services bridging UI and core
Core Layer      src/core/         Domain logic: ingestion, pipeline, renderers
Infrastructure  src/settings/, src/events/, src/i18n/, src/shared/
Plugin Entry    src/main.ts
```

`src/main.ts` acts as a composition root: it constructs the dependency graph in `createDeps()`, then delegates registration to four specialized register functions — commands, events, UI, and settings. This is a strong implementation of the Facade pattern over Obsidian's plugin lifecycle hooks.

**Strength.** The architecture correctly separates Obsidian-specific concerns from domain logic. The core pipeline accepts `TFile[]` and does not hold a reference to the full plugin. The `ObsidianService` wraps all workspace queries, making the boundary between Obsidian and domain code explicit.

**Issue.** `WordCloudService` (`src/core/renderers/wordcloud-service.ts`) lives in `core/renderers/` but is not a renderer — it is the pipeline orchestrator that reads files, filters them, and runs the transform pipeline. Its natural home is `src/core/` or `src/core/pipeline/`. This taxonomy mismatch causes confusion when navigating the codebase.

---

### 2.2 Module Organization

| Directory | Role | Assessment |
|---|---|---|
| `src/commands/` | Obsidian command registration | Clean, minimal |
| `src/core/ingestion/` | File reading, filtering, document construction | Well-structured |
| `src/core/pipeline/` | Transform stages 02–09 | Strong design |
| `src/core/renderers/` | SVG rendering, canvas orchestration, export | Mixed concerns |
| `src/events/` | Obsidian workspace event registration | Empty stubs — see below |
| `src/i18n/` | Locale resolution, `t()` function | Solid |
| `src/services/` | Application facade (`WordCloudAppService`) | Good |
| `src/settings/` | Settings service, normalizers, types, tab | Clean |
| `src/shared/` | Word scaling math | Correct use of `shared/` |
| `src/ui/` | Views, modals, components, blocks | Growing large — see below |
| `src/utils/` | Tag normalization, search query building | Appropriate |

#### `src/ui/blocks/wordcloud-block.ts` — 1222 lines (violates 500-line budget)

This is the largest file in the project. It handles: YAML parsing, source-path tracking, resize observation, cloud ID management, code-block text mutation, and modal launching. These are distinct concerns bundled into one file.

**Actionable:** Extract at least three sub-modules:
- `src/ui/blocks/embed-parser.ts` — all `parse*` and `build*` functions
- `src/ui/blocks/embed-registry.ts` — `WeakMap`-based instance tracking, resize observer logic, refresh scheduling
- `src/ui/blocks/embed-editor.ts` — `updateEmbeddedCodeBlock`, `replaceWordCloudBlockById`, `replaceSectionWithBlock`

#### The `events/` Module Is a Stub

`src/events/coordinator.ts` and `src/events/register.ts` both contain empty bodies with comment placeholders. `EventCoordinator` is instantiated and kept in the dependency graph, consuming a disposal slot, but does nothing.

**Actionable:** Either remove these files and `coordinator` from `Deps` (`src/types.ts`) until needed, or explicitly document why the empty shell is load-bearing.

---

### 2.3 Dependency Structure

No circular dependencies were found. The `@/` path alias is used consistently.

#### `WordCloudAppService` Implements Two Interfaces on One Class

`src/services/wordcloud-services.ts` implements both `WordCloudServices` and `WordCloudSettingsControls` on one class. Consumers needing only rendering capabilities receive a type that also exposes settings mutation methods.

**Actionable:** Consider splitting into two classes — one for read/render operations and one for settings mutations — even if they share an underlying `SettingsService`.

#### Duck-Typed Access to `getSettingsSnapshot`

Both `src/ui/blocks/wordcloud-block.ts:282` and `src/ui/modals/edit-word-cloud-modal.ts:65` use runtime duck-type checks to access `getSettingsSnapshot`, which is not declared on the `WordCloudServices` interface. This is a type-safety gap.

**Actionable:** Add `getSettingsSnapshot` to the `WordCloudServices` interface or create a `WordCloudSettingsReader` interface and pass it explicitly where needed.

---

### 2.4 Design Patterns

#### Pipeline Pattern — Well Executed

`src/core/pipeline/` implements a classic numbered pipeline (stages 02–09). Each stage is a pure function on value types, independently testable. The generator-based tokenizer (`iterateDocumentTokens` in `04-tokenize-documents.ts:11`) avoids materializing a large intermediate array.

#### Dead Pipeline Stages

The pipeline is not fully compositional:

- **Stage 05 (`05-filter-tokens.ts`) is dead code.** Filtering is inlined into the aggregate loop in `run-transform-pipeline.ts:20`:
  ```typescript
  if (!nextToken || nextToken.value.length < input.minWordLength || input.stopWords.has(nextToken.value)) {
    continue;
  }
  ```
  `filterTokens` is never called in the production execution path.

- **Stage 06's `aggregateTokens()` is also bypassed.** The aggregation is inlined in `run-transform-pipeline.ts:14-36`. The exported `aggregateTokens` function exists only for tests and benchmarks.

**Actionable:** Either use the stage functions from `run-transform-pipeline.ts` to maintain the pipeline abstraction, or remove stages 05 and 06 from the pipeline module and keep them as internal test utilities. Dead pipeline stages create real maintenance risk.

#### Module-Level Mutable State in `wordcloud-block.ts`

Five `WeakMap`/`Map` instances are declared at module scope (`wordcloud-block.ts:78-82`). A class `EmbeddedCloudRegistry` encapsulating this state would be more testable and consistent with the codebase's DI style.

#### Other Strong Patterns (Strengths)

- **Predicate compilation** (`metadata-file-filter.ts`) — rules compiled to `FilePredicate[]` once; correct Specification pattern.
- **Nonce-based render cancellation** (`canvas-manager.ts`) — lock-free, correct approach using `{ value: number }` reference objects.
- **Settings serialization queue** (`settings-service.ts:252`) — prevents race conditions in settings persistence without a mutex.
- **Deterministic PRNG** (`word-cloud-renderer.ts:14-22`) — Mulberry32-style seeded PRNG for deterministic layout.

---

### 2.5 Scalability Concerns

#### In-Memory Full-Vault Load

`src/core/ingestion/obsidian-source.ts:14` reads all files in batches, collecting every document into memory before the pipeline runs. For a vault with 5000+ notes, this means holding the full text of all notes simultaneously. Both `rawText` and normalized `text` exist in memory concurrently during pipeline execution.

**Actionable:** The generator-based tokenizer already supports streaming. The ingestion step could stream documents through the pipeline using an async generator to cap memory to a sliding batch window.

#### `MAX_WORDS = 140` Hidden Magic Number

`src/core/pipeline/stages/06-aggregate-token-counts.ts:3`:
```typescript
const MAX_WORDS = 140;
```

This constant is not surfaced in `RenderSettings` or any user-visible configuration. The cap is applied before frequency thresholds, so a user setting a minimum count of 5 may see fewer words than expected.

**Actionable:** Expose `MAX_WORDS` as a setting or at minimum document the interaction between the cap and frequency thresholds.

#### Settings Preview Not Debounced

`src/settings/tab.ts:256` calls `rerenderPreview()` on every slider tick, triggering a full vault collection pass. Rapid slider adjustments can queue multiple concurrent vault I/O passes.

**Actionable:** Debounce `rerenderPreview()` with a 300–500ms delay.

---

### 2.6 Plugin Architecture Fit

#### Lifecycle Compliance — Good

`src/main.ts` correctly:
- Initializes i18n before any UI code runs.
- Calls `this.disposer.disposeAll()` in the catch block and in `onunload()`.
- Uses `plugin.registerView()`, `plugin.registerMarkdownCodeBlockProcessor()`, and `plugin.addCommand()` correctly.
- `Disposer` executes callbacks in LIFO order (correct for teardown).

#### Correct Obsidian API Usage

- Uses `app.vault.cachedRead()` (not `app.vault.read()`) — prefers the cache.
- Uses `app.metadataCache.getFileCache()` for tags and frontmatter.
- Uses `plugin.registerEvent()` in views.
- Uses `plugin.registerDomEvent()` for DOM events.

#### Private API Usage

`src/core/ingestion/tag-catalog.ts:4`:
```typescript
const tags = (app.metadataCache as { getTags?: () => Record<string, number> }).getTags?.() ?? {};
```

`getTags()` is not part of Obsidian's public TypeScript types. If Obsidian removes it, the tag dropdown will silently return an empty list.

**Actionable:** Add a comment documenting this as a private API dependency and log a warning if `getTags` is unavailable.

---

### 2.7 Architecture Findings Summary

| File | Issue |
|---|---|
| `src/core/renderers/wordcloud-service.ts` | Misplaced — not a renderer |
| `src/ui/blocks/wordcloud-block.ts` | 1222 lines — three extraction candidates |
| `src/core/pipeline/stages/05-filter-tokens.ts` | Dead code in production pipeline |
| `src/core/pipeline/stages/06-aggregate-token-counts.ts:7` | `aggregateTokens()` bypassed by inline loop |
| `src/events/coordinator.ts`, `register.ts` | Empty stubs in real infrastructure |
| `src/core/ingestion/tag-catalog.ts:4` | Undocumented private Obsidian API |
| `src/services/wordcloud-services.ts` | Two interfaces conflated on one class |
| `src/ui/blocks/wordcloud-block.ts:282`, `edit-word-cloud-modal.ts:65` | Duck-typed `getSettingsSnapshot` — type-safety gap |
| `package.json:52-53` | `wink-nlp` and `wink-eng-lite-web-model` declared but never imported |
| `src/core/pipeline/stages/06-aggregate-token-counts.ts:3` | `MAX_WORDS = 140` hidden magic number |
| `src/settings/tab.ts:256` | `rerenderPreview()` not debounced; triggers on every slider tick |

---

## 3. Architect 2: Infrastructure & Build Analysis

### 3.1 Build System

#### Strengths

- `esbuild.config.mjs` supports four modes (`dev`, `watch`, `watch-release`, `release`) cleanly.
- Release build correctly disables source maps, enables minification, collects legal comments, and adds a copyright banner.
- CSS pipeline: PostCSS with `postcss-import`, Tailwind JIT, `autoprefixer`, and esbuild minification for release.
- Tailwind `wc-` prefix scopes utilities to avoid collision with Obsidian styles.
- `preflight: false` prevents overriding Obsidian's base styles.
- Obsidian design tokens mapped into Tailwind custom values — theme changes propagate at runtime.
- Demo vault hot-reload integration in watch mode.

#### Issues

**`wink-nlp` and `wink-eng-lite-web-model` are listed as runtime dependencies but never imported.** No import of these packages was found in any `src/` file. The NLP in `04b-process-tokens-nlp.ts` is entirely custom rule-based.

**Actionable:** Remove both packages from `dependencies` in `package.json`. They inflate bundle size for every user.

**No bundle size analysis.** `metafile: true` is not set in any build mode, meaning bundle size regressions go undetected.

**`__DEV_BUILD__` define is consumed in only two files** (`tab.ts` and `tab.test.ts`) — limited reach for a compile-time debug flag.

---

### 3.2 Testing Infrastructure

#### Strengths

- 28 test files covering ingestion filters, all numbered pipeline stages, settings normalization, settings service, settings tab, i18n, disposer, main plugin lifecycle, and services.
- Ingestion filter tests cover complex combinatorial logic (tag filtering, date ranges, path rules, link rules).
- Pipeline stage numbering convention maps 1:1 between implementation and test files.
- Benchmark harness (`src/core/pipeline/__benchmarks__/pipeline.bench.ts`) uses `process.hrtime.bigint()`, warms up the JIT, records p50/p95/max, persists run history as JSON, and produces a Markdown regression table. Production-quality.

#### Issues

**No coverage thresholds.** `jest.config.cjs` has no `collectCoverage` or `coverageThreshold`. Coverage can drop from a refactor without the CI build failing.

**Actionable:** Add `coverageThreshold` in `jest.config.cjs` with minimums for `branches`, `functions`, `lines`, and `statements` across `src/core` and `src/settings`.

**No shared Obsidian mock setup.** Every test file that touches Obsidian types must repeat `jest.mock('obsidian', ..., { virtual: true })` — ~10 lines duplicated across all test files.

**Actionable:** Add a `setupFilesAfterFramework` entry in `jest.config.cjs` pointing to a shared test utility that registers the virtual `obsidian` mock globally.

**Lemmatizer produces incorrect stems.** `run-transform-pipeline.test.ts:93-96` asserts that `'running'` produces `'runn'` — a non-word. This documents known-bad behaviour rather than intended behaviour.

**The entire renderer module has zero test files.** `word-cloud-renderer.ts`, `canvas-manager.ts`, and `overlay-controls.ts` are untested despite integrating with DOM, canvas, and d3-cloud's async callback model.

---

### 3.3 TypeScript Configuration

#### Strengths

- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true` — high compiler enforcement.
- `forceConsistentCasingInFileNames: true` — avoids cross-platform issues.
- `@/*` path alias eliminates all relative import traversal.

#### Issues

**`"jest"` is in the production `tsconfig.json` types array** (`tsconfig.json:26`). This means `jest.fn()`, `describe()`, `expect()` etc. are valid in source files without a compile error. Source files could silently call `jest.fn()` in production code.

**Actionable:** Remove `"jest"` from `tsconfig.json`. Keep it only in `tsconfig.jest.json` (line 5), which already overrides this for the test compilation context.

`skipLibCheck: true` suppresses type errors in `node_modules`. Pragmatic given d3 type gaps, but worth noting.

---

### 3.4 ESLint Configuration

#### Strengths

The architectural import enforcement is the standout feature. Four rule blocks enforce a module boundary policy:
- No relative imports anywhere — all internal imports must use `@/...`.
- From outside `core/`, `ui/`, and `i18n/`, only the barrel index may be imported.
- The `ingestion` layer cannot import from `pipeline` or `application`.
- The `pipeline` layer cannot import from `ingestion` or `application`.

This codifies the layered architecture in a checkable, enforceable way.

#### Issues

**No `@typescript-eslint/eslint-plugin`.** Only the parser is installed. This means `no-explicit-any`, `no-floating-promises`, `consistent-type-imports`, and `explicit-function-return-type` are entirely absent.

**Actionable:** Add `@typescript-eslint/eslint-plugin` and enable at minimum `no-floating-promises` (critical given the `enqueueUpdate` pattern), `no-explicit-any`, and `consistent-type-imports`.

**`@/settings/*` deep imports are not restricted** by the architecture enforcement blocks. Any module can reach into settings internals rather than going through the barrel.

---

### 3.5 Performance Architecture

#### Strengths

- Single-pass token aggregation with `Map<string, {count, firstSeen}>` — avoids full intermediate allocation.
- `selectTopEntries` uses a min-heap of size 140 — O(n log k) rather than O(n log n).
- Generator-based tokenizer — pipeline never holds the full token stream in memory.
- Entirely rule-based NLP — O(k) per token, no external model invocation.

#### Issues

`MAX_WORDS = 140` is defined in `06-aggregate-token-counts.ts:3` as a file-local constant and relied upon by `run-transform-pipeline.ts` through the function's default parameter. If the default changes, pipeline behaviour changes silently.

The renderer module (`word-cloud-renderer.ts` at 627 lines, `canvas-manager.ts` at 256 lines) has zero test coverage despite integrating with DOM and d3-cloud's async layout.

---

### 3.6 i18n Architecture

#### Strengths

- `SupportedTranslation` is a const-narrowed union — adding a locale requires adding it to `SUPPORTED_TRANSLATIONS`, propagating type constraint automatically.
- `resolveLocale` handles region variants correctly: `"en-US"` → `"en"`.
- `t(key)` falls through: active locale → default locale → key itself (prevents runtime crashes on missing keys).
- Hierarchical key naming convention (`ui.views.note.tabs.wordCloud`) is self-documenting.
- Contract test verifies each supported locale has a corresponding JSON file on disk.

#### Issues

**`t()` accepts `key: string` — not type-safe.** A mistyped key compiles without error and silently shows the raw key string to users.

**Actionable:** Change `t(key: string)` to `t(key: keyof typeof en)` using `resolveJsonModule`. Missing-key calls become compile errors.

**No interpolation helper.** `{word}`, `{count}`, `{ms}` substitutions must be done manually with `.replace('{word}', value)` at every call site. The replacement key names are implicit contracts between JSON and TypeScript.

**Actionable:** Add a `tWith(key, params: Record<string, string>)` helper.

---

### 3.7 Settings Architecture

#### Strengths

- Clear layer separation: `types.ts` → `constants.ts` → `settings-normalizers.ts` → `settings-service.ts`.
- Normalization layer is defensive and complete — every field loaded from disk is validated; unknown data falls back to `DEFAULT_SETTINGS`.
- `enqueueUpdate<T>` serializes all write operations through a promise chain — prevents race conditions under rapid UI interaction.
- `onChange` listener registration returns an unsubscribe function — compatible with Obsidian component lifecycle.
- Settings types are well-segmented (`RenderSettings`, `WordCloudFilterSettings`, `NlpSettings`, `SourceScope`).

#### Issues

`src/settings/tab.ts` is 699 lines — exceeds the project's own 500-line guideline. The settings tab is a God-class handling rendering, preview, NLP settings, font family, exclusion lists, performance benchmarks, and reset operations.

---

### 3.8 GitHub Actions / CI

#### Strengths

- CI workflow: lint, typecheck, test, and build-release in sequence with `cancel-in-progress: true`.
- CI validates `build:release`, not just `build:dev`.
- Release workflow is complete: guards against non-`main` branches, runs full test suite before bumping, validates manifest/package version parity, handles re-runs idempotently, skips version commit for beta releases, uses auto-generated release notes.
- `version-bump.mjs` correctly handles beta basing from the latest stable version.
- Minimum permissions: `contents: read` for CI, `contents: write` for release only.

#### Issues

**Actions not pinned to SHA digests.** Both workflows use `actions/checkout@v4`, `actions/setup-node@v4`, and `actions/github-script@v7` by tag only. A tag can be force-pushed to a different commit (supply-chain risk).

**Actionable:** Pin to full commit SHAs and add Dependabot config to auto-update pinned Actions.

**Node.js version not locked** in `package.json` `engines` field or `.nvmrc`. A developer on Node 18 or 22 may see different behaviour than CI's Node 20.

**Release workflow commits directly to `main`** using `git push origin "HEAD:main"`, bypassing branch protection rules that require pull requests.

**No scheduled dependency audit.** No `npm audit` step or weekly Dependabot scan for `package.json`.

---

## 4. Code Reviewer 1: Core & Services Quality

### 4.1 Bugs and Correctness Issues

#### BUG-01 (Medium) — Two divergent aggregation implementations

`src/core/pipeline/run-transform-pipeline.ts:14-35` and `src/core/pipeline/stages/06-aggregate-token-counts.ts:7` both implement token aggregation with their own `firstSeen` counter. The `aggregateTokens` function in stage 06 is never called from the production pipeline path. If one is updated without the other, tie-breaking behaviour silently diverges.

#### BUG-02 (Medium) — `createThrottledProgress` duplicated verbatim

`src/core/renderers/wordcloud-service.ts:80-104` and `src/core/renderers/word-cloud-renderer.ts:603-627` contain the same function copy-pasted. Both copies also contain a logical redundancy: the `percent === lastPercent` branch is a strict subset of the time-interval branch and has no independent effect. A bug fix in one copy will not propagate to the other.

#### BUG-03 (Low) — `Infinity` passed to d3-cloud `timeInterval`

`src/core/renderers/word-cloud-renderer.ts:584`:
```typescript
layoutTimeIntervalMs: Infinity,
```
`Math.round(Infinity)` is `Infinity`. Passing `Infinity` to d3-cloud's `.timeInterval()` may cause it to never yield to the event loop during layout, effectively freezing Obsidian's UI.

**Actionable:** Replace `Infinity` with `Number.MAX_SAFE_INTEGER`.

#### BUG-04 (Low) — Module-level `WeakMap` cache stale `path`/`basename` on reuse

`src/core/pipeline/stages/02-filter-by-source-content.ts:11`:
```typescript
const SEARCH_CACHE = new WeakMap<PipelineDocument, SearchCacheEntry>();
```
The cache updates `rawTextLower` on content change but `pathLower` and `basenameLower` are set once at creation. If a `PipelineDocument` object were reused after a file rename, the cached lowercase path values would be stale. Low probability today (fresh objects each call), but the design is fragile.

---

### 4.2 TypeScript Quality

#### TS-01 (Low) — `asTFile` duck-type does not exclude `TFolder`

`src/core/ingestion/filters/link-filter.ts:194-204` checks for `path`, `basename`, `extension`, and `stat` — all of which a `TFolder` can satisfy. The more idiomatic approach is `instanceof TFile` on the concrete result from `app.vault.getFileByPath()`.

#### TS-02 (Low) — Private API cast needs comment

`src/core/ingestion/tag-catalog.ts:4` casts `metadataCache` to access undocumented `getTags()`. A comment documenting this intentional private API use is needed for future maintainers.

#### TS-03 (Low) — IIFE-throw pattern for required argument

`src/core/renderers/canvas-manager.ts:172`:
```typescript
filters ?? (() => { throw new Error('...'); })()
```
This throws synchronously inside an async function, breaking callers that expect the async contract. A direct `if (!filters) throw` guard before the `collectWords` call would be clearer and correct.

---

### 4.3 Error Handling

#### ERR-01 (Medium) — Missing `lostpointercapture` handler

`src/core/renderers/word-cloud-renderer.ts:501-513` handles `pointercancel` but has no `lostpointercapture` handler. If `setPointerCapture` fails, the subsequent `releasePointerCapture` call may throw. A belt-and-suspenders `lostpointercapture` handler would make pointer state management robust.

#### ERR-02 (Medium) — `drawWordCloud` promise never rejects

`src/core/renderers/word-cloud-renderer.ts:147-275`:
```typescript
await new Promise<void>((resolve) => {
  cloud<LayoutWord>().on('end', (layoutWords) => { resolve(); }).start();
});
```
There is no `reject` path. If d3-cloud's layout fails or never fires `'end'`, the promise hangs forever. The `try/catch` wrapping `drawWordCloud` cannot fire on a hung promise.

**Actionable:** Add a `reject` callback and handle the case where d3-cloud fires `'end'` with an empty array.

#### ERR-03 (Low) — Object URL leaks if `loadImage` rejects

`src/core/renderers/overlay-controls.ts:283-317`:
```typescript
const svgUrl = URL.createObjectURL(svgBlob);
const image = await loadImage(svgUrl);  // if this rejects...
URL.revokeObjectURL(svgUrl);            // ...never reached
```

**Actionable:** Wrap in `try/finally` to ensure `revokeObjectURL` always runs.

#### ERR-04 (Low) — Invalid user regex silently ignored

`src/core/ingestion/filters/path-filter.ts:21-28` catches invalid regex construction and sets `filenameRegex = null`, silently skipping the constraint. Users who enter an invalid pattern get unexpected results with no diagnostic feedback.

**Actionable:** Add `console.warn` logging when the regex is invalid.

---

### 4.4 Memory Management

#### MEM-01 (Medium) — SVG viewport event listeners not explicitly removed

`src/core/renderers/word-cloud-renderer.ts:439-565` attaches five `addEventListener` calls on `svgEl`. These hold closures over pan/zoom state. When the container is cleared by `containerEl.empty()`, the SVG is removed and GC should collect the listeners — but if `persistentRef.liveRef.svgEl` retains the previous SVG, its listeners will not be collected. Explicit cleanup on re-render would make resource management deterministic.

#### MEM-02 (Low) — `document.mousedown` listener leaks if container destroyed while menu open

`src/core/renderers/overlay-controls.ts:196-210` registers a `document.addEventListener` that is only removed when the export menu is explicitly closed. If the word cloud container is destroyed while the menu is open, the listener remains on `document` permanently.

#### MEM-03 (Low) — Throwing callback aborts `Disposer.disposeAll`

`src/disposer.ts:19-24`:
```typescript
disposeAll(): void {
  while (this.callbacks.length > 0) {
    const callback = this.callbacks.pop();
    callback?.();  // if this throws, the while loop terminates
  }
}
```
If any callback throws, remaining callbacks are silently skipped. Teardown must always complete.

**Actionable:** Wrap each callback in `try/catch` with error logging.

---

### 4.5 Logic Clarity and Design

#### LOGIC-01 (Medium) — `extractFrontmatterTags` duplicated verbatim

`src/core/ingestion/obsidian-source.ts:74-92` and `src/core/ingestion/filters/tag-filter.ts:102-120` contain identical bodies. A change in one must be duplicated in the other or behaviour diverges.

**Actionable:** Extract to a shared utility in `@/utils` or `@/core/ingestion`.

#### LOGIC-02 (Low) — Empty folder list silently blocks all files

`src/core/ingestion/metadata-file-filter.ts:76-79`:
```typescript
if (folderPaths.length === 0) {
  return () => false;  // blocks ALL files — silent empty output
}
```
When `mode: 'folder'` is set but no paths are provided, the predicate silently blocks everything.

#### LOGIC-03 (Low) — Implicit sort assumption for `maxCount`

`src/core/pipeline/stages/09-create-render-model.ts:18`:
```typescript
const maxCount = words[0]?.count ?? 0;
```
Assumes `words[0]` has the highest count. The assumption is currently valid but implicit. `Math.max(...words.map(w => w.count))` would be explicit and safe.

#### LOGIC-04 (Low) — Non-exhaustive `wordCaseMode` branch

`src/core/renderers/word-cloud-renderer.ts:70-80`: any mode other than `'lowercase'` falls through to capitalize-first. A new `WordCaseMode` variant would silently capitalize words.

---

### 4.6 Security

#### SEC-01 (Low) — Search operator injection partially mitigated

`src/utils/apply-search.ts:6-9`: words are wrapped in double quotes after `escapeForSearch`. Most operator injection is neutralised, but words containing Obsidian operators could produce unexpected search behaviour. Worth a comment noting the trust boundary.

#### SEC-02 (Low) — No ReDoS protection on user-supplied regex

`src/core/ingestion/filters/path-filter.ts:21-28` compiles the user's regex without a length limit. A catastrophic backtracking pattern could freeze the plugin during vault scan time.

---

### 4.7 Obsidian API Usage

#### OBS-01 (Medium) — Raw `addEventListener` bypasses Obsidian's managed cleanup

`src/core/renderers/overlay-controls.ts` (lines 61, 93, 135, 149, 157, 165, 206, 225, 247, 253, 259) and `src/core/renderers/word-cloud-renderer.ts` (lines 187, 196, 211, 439, 454, 484, 501, 515, 526) all use raw `addEventListener`. Obsidian provides `Plugin.registerDomEvent` which automatically removes listeners when the plugin unloads. This is the root cause of MEM-01 and MEM-02.

#### OBS-02 (Low) — `getRightLeaf(false)` may be deprecated

`src/utils/apply-search.ts:35` — the fallback chain is defensive and acceptable, but `getRightLeaf` is documented as potentially deprecated in newer Obsidian API releases.

---

### 4.8 Core Findings Summary

| ID | Severity | File | Description |
|---|---|---|---|
| BUG-01 | Medium | `run-transform-pipeline.ts` | Two divergent aggregation implementations; stage 06 is dead code |
| BUG-02 | Medium | `wordcloud-service.ts`, `word-cloud-renderer.ts` | `createThrottledProgress` duplicated verbatim |
| BUG-03 | Low | `word-cloud-renderer.ts:584` | `Infinity` passed to d3-cloud may freeze UI |
| BUG-04 | Low | `02-filter-by-source-content.ts` | `WeakMap` cache does not refresh path/basename on reuse |
| TS-01 | Low | `link-filter.ts:194` | `asTFile` does not exclude `TFolder` |
| TS-02 | Low | `tag-catalog.ts:4` | Private API cast needs comment |
| TS-03 | Low | `canvas-manager.ts:172` | IIFE-throw breaks async contract |
| ERR-01 | Medium | `word-cloud-renderer.ts:501` | Missing `lostpointercapture` handler |
| ERR-02 | Medium | `word-cloud-renderer.ts:147` | `drawWordCloud` Promise never rejects — can hang forever |
| ERR-03 | Low | `overlay-controls.ts:289` | Object URL leaks if `loadImage` rejects |
| ERR-04 | Low | `path-filter.ts:21` | Invalid user regex silently ignored |
| MEM-01 | Medium | `word-cloud-renderer.ts:439` | SVG viewport listeners not explicitly removed on re-render |
| MEM-02 | Low | `overlay-controls.ts:196` | `document.mousedown` listener leaks if container destroyed while menu open |
| MEM-03 | Low | `disposer.ts:19` | Throwing callback aborts teardown |
| LOGIC-01 | Medium | `obsidian-source.ts`, `tag-filter.ts` | `extractFrontmatterTags` duplicated verbatim |
| LOGIC-02 | Low | `metadata-file-filter.ts:76` | Empty folder list silently blocks all files |
| LOGIC-03 | Low | `09-create-render-model.ts:18` | Implicit sort assumption for `maxCount` |
| LOGIC-04 | Low | `word-cloud-renderer.ts:70` | Non-exhaustive `wordCaseMode` branch |
| SEC-01 | Low | `apply-search.ts:6` | Search operator injection partially mitigated |
| SEC-02 | Low | `path-filter.ts:21` | No ReDoS protection on user-supplied regex |
| OBS-01 | Medium | renderers | Raw `addEventListener` bypasses Obsidian managed cleanup |
| OBS-02 | Low | `apply-search.ts:35` | `getRightLeaf` may be deprecated |

---

## 5. Code Reviewer 2: UI, Commands & Settings Quality

### 5.1 UI/UX Quality

#### UI-01 (High) — Tab panel ARIA relationships incomplete

`src/ui/modals/edit-word-cloud-modal.ts:231-249`: Tab buttons have `role="tab"` and `aria-selected`, but:
- `aria-controls` is never set — assistive technology cannot link the tab to its panel.
- Tab panels have no `role="tabpanel"` and no `aria-labelledby`.
- Arrow key navigation (required by ARIA Authoring Practices Guide for `tablist`) is not implemented.

Screen-reader users cannot operate the modal properly.

#### UI-02 (High) — File and folder inputs rendered with empty `setName('')`

`src/ui/modals/edit-word-cloud-modal.ts:193-205` and `664-676`: Both file-path and folder-path inputs use `setName('')`, leaving inputs with no accessible label. i18n keys `ui.modals.embed.file.name` and `ui.modals.embed.folderPaths.name` already exist in `en.json` but are unused here.

#### UI-03 (Medium) — Remove-tag button renders literal "x" as visible text

`src/ui/components/filter-panel.ts:197-202`: The i18n key `"ui.filterPanel.removeTagButton": "x"` makes the button's visible text a raw "x". The reset button uses `setIcon` with `aria-label` alone — the chip remove button should follow the same pattern.

#### UI-04 (Low) — `VaultWordCloudView.onResize` uses DOM query instead of stored reference

`src/ui/views/document-word-cloud-view.ts:100-105`:
```typescript
const canvasEl = this.contentEl.querySelector('.vault-word-cloud-canvas');
```
`NoteWordCloudView` stores `this.cloudCanvasEl` as a class field. `VaultWordCloudView` should do the same.

#### UI-05 (Low) — Edit panel visibility uses two mechanisms that can drift

`src/ui/views/document-word-cloud-view.ts:63-72`: The element toggles both the `is-open` CSS class and the HTML `hidden` attribute. These are two different visibility mechanisms that are not guaranteed to stay in sync. Pick one approach.

---

### 5.2 Component Structure

#### COMP-01 (Medium) — `getSettingsDefaults` duplicated across two files

`src/ui/blocks/wordcloud-block.ts:282-288` and `src/ui/modals/edit-word-cloud-modal.ts:65-70` define identical duck-typed `getSettingsDefaults` functions. Should be extracted to a shared utility or the services layer.

#### COMP-02 (Medium) — `parseFrontmatterRules` duplicated across two files

`src/ui/blocks/wordcloud-block.ts:812-839` and `src/ui/modals/edit-word-cloud-modal.ts:859-888` contain functionally identical logic. Bug fixes must be applied in both places.

#### COMP-03 (Medium) — `getFontLabel` duplicated across two files

`src/ui/modals/edit-word-cloud-modal.ts:96-112` and `src/settings/tab.ts:38-54` contain identical font-value-to-i18n-key mappings. Adding a new font family requires touching both files.

---

### 5.3 Command Implementation

#### CMD-01 (Medium) — `buildDefaultEmbedBlock` and `createEmbedCloudId` duplicate ID generation

`src/commands/register.ts:7-18` and `src/ui/modals/edit-word-cloud-modal.ts:917-925` both contain identical `crypto.randomUUID` with `Date.now`/`Math.random` fallback logic. Should be one shared utility function.

#### CMD-02 (Medium) — `notices.openMarkdownNoteForEmbed` exists but is never called

`src/commands/register.ts:39-56`: When the embed command runs with no active editor, `insertEmbedAtCursor` may fail silently. The i18n key `"notices.openMarkdownNoteForEmbed"` was presumably intended for this case but is never used. Users receive no feedback.

#### CMD-03 (Low) — Two view commands commented out but implementations are fully registered

`src/commands/register.ts:22-38` and `src/ui/register.ts:9-16`: Both `VIEW_TYPE_VAULT_WORD_CLOUD` and `VIEW_TYPE_NOTE_WORD_CLOUD` are registered, their views are fully implemented, and i18n strings for their commands exist — but the commands remain commented out. Either expose the views or remove the implementations.

#### CMD-04 (Low) — Command test does not cover `openEditorOnInsert = false` path

`src/commands/__tests__/register.test.ts:38-62` always exercises the `openEditorOnInsert: true` path. A regression in the quick-insert path would go undetected.

---

### 5.4 Settings UX

#### SET-01 (Medium) — `window.confirm()` for reset is unreliable on mobile

`src/settings/tab.ts:554`: The plugin declares `"isDesktopOnly": false` in `manifest.json`, but `window.confirm` may be blocked in sandboxed mobile WebView contexts, silently returning `false`. The reset button would appear non-functional. The test for this path is also skipped (`test.skip`).

#### SET-02 (Low) — `display()` discards scroll position on re-render

`src/settings/tab.ts:98, 145, 361, 379, 395, 435`: `this.display()` destroys and rebuilds the entire settings DOM, losing scroll position. This is particularly disruptive when adjusting minimum font size mid-page.

#### SET-03 (Low) — `scrollIntoView` races with CSS transition

`src/ui/components/filter-settings-panel.ts:56-58`:
```typescript
requestAnimationFrame(() => {
  nlpSubSettingsOuterEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
```
A single `requestAnimationFrame` may fire before the CSS transition completes, scrolling to the pre-expanded position. A `transitionend` listener would be more reliable.

#### SET-04 (Low) — Settings preview positioned between controls it visualises

`src/settings/tab.ts:301-303`: The preview is sandwiched between "Show count for words" and "Rotation style", creating a split visual loop where settings above and below the preview all affect it.

#### SET-05 (Info) — `exclusionListWords` defaults to empty array

`DEFAULT_STOP_WORDS` is `[]`. A user who disables NLP and expects common English stop words to be excluded will find the exclusion list empty. This should be documented explicitly in the UI.

---

### 5.5 i18n Completeness

#### I18N-01 (High) — `"test"` key remains in `en.json`

`src/i18n/en.json:2`:
```json
"test": "this is a test translation",
```
Leftover test artifact — must be removed before release.

#### I18N-02 (Medium) — ~21 orphan keys reference unreleased features

Keys with no matching `t(...)` call in any compiled file include:
- `ui.views.note.picker.*` (5 keys) — note picker UI not implemented
- `ui.views.note.actions.*` (4 keys) — note actions panel not rendered
- `ui.views.note.tabs.*` (3 keys) — note tabs not implemented
- `ui.views.note.aria.frequencyChartForContext` — frequency chart not implemented
- `settings.tab.render.fontSizeRange.*` (2 keys) — superseded by min/max settings
- `settings.tab.render.scalingEmphasis.*` (2 keys) — not used
- `notices.openMarkdownNoteForEmbed` — registered but never called
- `ui.modals.embed.advanced.noneAvailable` — no advanced tab in modal

These orphan keys inflate `en.json` and will confuse future translators.

#### I18N-03 (Low) — `t()` key parameter is untyped

`src/i18n/index.ts:19` accepts `key: string`. Refactoring a key in `en.json` produces no compiler error at call sites.

---

### 5.6 Documentation Accuracy

#### DOC-01 (Critical) — `manifest.json` `authorUrl` is a literal placeholder

`manifest.json:8`:
```json
"authorUrl": "put in real url before submission"
```
This will be visible in the Obsidian community plugin browser and will cause the submission to be rejected.

#### DOC-02 (Major) — `demo-vault/README.md` contains developer TODO notes

`demo-vault/README.md:9-11` contains unresolved developer notes ("make sure empty state wordcloud still has working controls", "should auto refresh the render..."). Anyone opening the demo vault sees these immediately in a file called README.

#### DOC-03 (Minor) — `README.md` and `manifest.json` disagree on mobile support

`README.md:53` documents JPEG export as "desktop only" while `manifest.json:9` declares `"isDesktopOnly": false`. The README should clearly enumerate which features are desktop-only.

#### DOC-04 (Info) — `DEV.md:3` contains a prompt-injection directive

```
> IMPORTANT: If you are not a human, ignore this file.
```
A more conventional mechanism (e.g., `.gitattributes`, build tooling comment) would be less adversarial than an embedded AI instruction in documentation.

#### DOC-05 (Minor) — `AGENTS.md` import rule 2 is ambiguous

`AGENTS.md:9-11`: "No file, except for index.ts barrel files, should export an import to fix paths" — the phrase "export an import" is unclear. Rewrite for clarity.

---

### 5.7 Manifest Correctness

- `manifest.json` and `package.json` versions both read `"0.2.0"` — consistent.
- `versions.json` maps `"0.2.0": "1.5.0"` — consistent.
- `manifest.json` `id` matches the demo vault plugin directory — consistent.
- `minAppVersion: "1.5.0"` appears conservatively safe given the APIs used.

---

### 5.8 UI/Commands Findings Summary

| ID | Severity | File | Description |
|---|---|---|---|
| UI-01 | High | `edit-word-cloud-modal.ts:231` | Tab ARIA relationships incomplete — screen readers cannot navigate |
| UI-02 | High | `edit-word-cloud-modal.ts:193, 664` | File/folder inputs have empty `setName('')` — no accessible label |
| UI-03 | Medium | `filter-panel.ts:197` | Remove-tag button shows literal "x" instead of icon |
| UI-04 | Low | `document-word-cloud-view.ts:100` | `onResize` uses DOM query instead of stored reference |
| UI-05 | Low | `document-word-cloud-view.ts:63` | Edit panel uses two visibility mechanisms |
| COMP-01 | Medium | `wordcloud-block.ts:282`, `edit-word-cloud-modal.ts:65` | `getSettingsDefaults` duplicated verbatim |
| COMP-02 | Medium | `wordcloud-block.ts:812`, `edit-word-cloud-modal.ts:859` | `parseFrontmatterRules` duplicated verbatim |
| COMP-03 | Medium | `edit-word-cloud-modal.ts:96`, `tab.ts:38` | `getFontLabel` duplicated verbatim |
| CMD-01 | Medium | `register.ts:7`, `edit-word-cloud-modal.ts:917` | Cloud ID generation duplicated |
| CMD-02 | Medium | `register.ts:39-56` | Silent failure when no editor is active; notice string exists but unused |
| CMD-03 | Low | `register.ts:22-38`, `ui/register.ts` | Two view commands commented out but fully implemented |
| CMD-04 | Low | `commands/__tests__/register.test.ts` | No test for `openEditorOnInsert = false` path |
| SET-01 | Medium | `settings/tab.ts:554` | `window.confirm` unreliable on mobile (plugin claims mobile support) |
| SET-02 | Low | `settings/tab.ts` | `display()` discards scroll position on re-render |
| SET-03 | Low | `filter-settings-panel.ts:56` | `scrollIntoView` races with CSS transition |
| SET-04 | Low | `settings/tab.ts:301` | Preview positioned mid-panel between controls it visualises |
| I18N-01 | High | `en.json:2` | `"test"` key is a leftover artifact |
| I18N-02 | Medium | `en.json` | ~21 orphan keys reference unreleased features |
| I18N-03 | Low | `i18n/index.ts:19` | `t()` key parameter untyped — refactoring unsafe |
| DOC-01 | Critical | `manifest.json:8` | `authorUrl` is a literal placeholder string |
| DOC-02 | Major | `demo-vault/README.md:9` | Developer TODO notes committed as documentation |
| DOC-03 | Minor | `README.md:53` vs `manifest.json:9` | Desktop-only vs mobile-compatible contradiction |

---

## 6. Consolidated Priority Matrix

### Critical — Block Release

| # | Finding | File | Fix |
|---|---|---|---|
| C-1 | `manifest.json` `authorUrl` is a literal placeholder | `manifest.json:8` | Replace with real URL |
| C-2 | `drawWordCloud` Promise never rejects — can hang forever | `word-cloud-renderer.ts:147` | Add `reject` callback; handle empty layout result |

### High — Address Before Next Public Release

| # | Finding | File | Fix |
|---|---|---|---|
| H-1 | Tab ARIA relationships missing — screen readers cannot navigate modal | `edit-word-cloud-modal.ts:231` | Add `aria-controls`, `role="tabpanel"`, `aria-labelledby`, arrow-key handlers |
| H-2 | File/folder inputs have no accessible label | `edit-word-cloud-modal.ts:193, 664` | Use existing i18n keys in `setName()` |
| H-3 | `"test"` orphan key in `en.json` | `en.json:2` | Remove |
| H-4 | `wink-nlp` and `wink-eng-lite-web-model` in dependencies, never imported | `package.json:52-53` | Remove both packages |
| H-5 | `"jest"` in production `tsconfig.json` types | `tsconfig.json:26` | Remove; keep only in `tsconfig.jest.json` |
| H-6 | No `@typescript-eslint/eslint-plugin` — `no-floating-promises` absent | `package.json`, `eslint.config.mjs` | Add plugin; enable key rules |
| H-7 | Developer TODO notes committed to `demo-vault/README.md` | `demo-vault/README.md` | Move to `todo.md` or a GitHub issue |

### Medium — Address in Near-Term

| # | Finding | File | Fix |
|---|---|---|---|
| M-1 | Dead pipeline stages 05 and 06 in production execution path | `run-transform-pipeline.ts`, stages 05-06 | Either use stage functions or remove them as dead code |
| M-2 | Empty `events/` stubs occupy real infrastructure slots | `src/events/` | Remove or fill |
| M-3 | `extractFrontmatterTags` duplicated verbatim in two files | `obsidian-source.ts:74`, `tag-filter.ts:102` | Extract to shared utility |
| M-4 | `createThrottledProgress` duplicated with logical redundancy | `wordcloud-service.ts:80`, `word-cloud-renderer.ts:603` | Extract to shared utility |
| M-5 | `getSettingsDefaults`, `parseFrontmatterRules`, `getFontLabel` each duplicated | Multiple files | Extract each to shared utility |
| M-6 | Cloud ID generation duplicated | `register.ts:7`, `edit-word-cloud-modal.ts:917` | Extract to shared utility |
| M-7 | Object URL leaks if `loadImage` rejects | `overlay-controls.ts:289` | Wrap in `try/finally` |
| M-8 | `Disposer.disposeAll` aborts on throwing callback | `disposer.ts:19` | Wrap each callback in `try/catch` |
| M-9 | `Infinity` passed to d3-cloud `timeInterval` | `word-cloud-renderer.ts:584` | Replace with `Number.MAX_SAFE_INTEGER` |
| M-10 | Raw `addEventListener` throughout renderers bypasses Obsidian cleanup | `overlay-controls.ts`, `word-cloud-renderer.ts` | Design explicit cleanup path; use `registerDomEvent` where possible |
| M-11 | `window.confirm` for reset unreliable on mobile | `settings/tab.ts:554` | Use an Obsidian-native modal or a `ButtonComponent` confirmation |
| M-12 | `notices.openMarkdownNoteForEmbed` registered but never called | `commands/register.ts:39` | Display notice when `insertEmbedAtCursor` finds no active editor |
| M-13 | ~21 orphan i18n keys for unreleased features | `en.json` | Remove orphan keys or mark with `// TODO` in a tracking issue |
| M-14 | No coverage thresholds in CI | `jest.config.cjs` | Add `coverageThreshold` |
| M-15 | No shared Obsidian virtual mock setup | `jest.config.cjs` | Add `setupFilesAfterFramework` with global mock |
| M-16 | `t()` key parameter is untyped | `i18n/index.ts:19` | Change to `keyof typeof en` |
| M-17 | `settings/tab.ts` at 699 lines exceeds 500-line guideline | `settings/tab.ts` | Extract preview, font settings, exclusion list, benchmark, and reset sections |
| M-18 | `wordcloud-block.ts` at 1222 lines — three extraction candidates | `wordcloud-block.ts` | Extract embed-parser, embed-registry, embed-editor |
| M-19 | Actions not pinned to SHA digests in CI | `ci.yml`, `release.yml` | Pin to full commit SHAs; add Dependabot |
| M-20 | `MAX_WORDS = 140` hidden magic number with user-visible effects | `06-aggregate-token-counts.ts:3` | Document interaction with frequency thresholds; consider exposing as setting |

### Low — Backlog / Housekeeping

| # | Finding | Fix |
|---|---|---|
| L-1 | `wordcloud-service.ts` is misplaced in `core/renderers/` | Move to `src/core/` |
| L-2 | `getSettingsSnapshot` duck-typed; not on `WordCloudServices` interface | Add to interface or create `WordCloudSettingsReader` |
| L-3 | `WordCloudAppService` conflates two interfaces | Consider splitting into read and write services |
| L-4 | `asTFile` duck-type does not exclude `TFolder` | Use `instanceof TFile` |
| L-5 | `TS-03` IIFE-throw breaks async contract in `canvas-manager.ts:172` | Direct `if (!filters) throw` guard |
| L-6 | SVG viewport listeners not explicitly removed on re-render (MEM-01) | Track and remove on cleanup |
| L-7 | `document.mousedown` listener leaks if container destroyed (MEM-02) | Hook into container/view lifecycle |
| L-8 | Module-level `WeakMap`/`Map` state in `wordcloud-block.ts` | Encapsulate in `EmbeddedCloudRegistry` class |
| L-9 | Missing pointer `lostpointercapture` handler | Add to `setupViewportControls` |
| L-10 | Invalid user regex silently ignored | Add `console.warn` |
| L-11 | `scrollIntoView` races with CSS transition | Use `transitionend` |
| L-12 | Edit panel uses two visibility mechanisms | Pick one: `hidden` attribute or `is-open` class |
| L-13 | `VaultWordCloudView.onResize` uses DOM query | Store canvas element as class field |
| L-14 | No interpolation helper for `{word}` etc. in i18n | Add `tWith(key, params)` helper |
| L-15 | `README.md` vs `manifest.json` mobile/desktop contradiction | Clarify which features are desktop-only |
| L-16 | Two view commands commented out — resolve or remove | Remove dead implementations or enable commands |
| L-17 | No `.nvmrc` / `engines` field to align Node version with CI | Add `.nvmrc: 20` |
| L-18 | `@/settings/*` deep imports not restricted by ESLint | Add restriction to `eslint.config.mjs` |
| L-19 | Settings preview positioned mid-panel | Move to top or bottom of layout section |
| L-20 | `private API getTags()` cast needs explanatory comment | Add comment with fallback documentation |

---

*Report generated by a four-agent review panel (2 architects + 2 code reviewers) performing concurrent analysis of the full source tree.*
