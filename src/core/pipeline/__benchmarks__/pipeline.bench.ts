import { runTransformPipeline } from '@/core/pipeline';
import type { PipelineDocument } from '@/core';
import { DEFAULT_SETTINGS } from '@/settings/constants';
import type { NlpSettings } from '@/settings/types';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

type BenchmarkConfig = {
  vaultPath: string;
  repeatFactor: number;
  warmupRuns: number;
  measuredRuns: number;
};

type BenchmarkProfileResult = {
  name: string;
  minMs: number;
  avgMs: number;
  p95Ms: number;
  maxMs: number;
  throughputDocsPerSecond: number;
};

type BenchmarkRunRecord = {
  epochMs: number;
  runId: string;
  vaultPath: string;
  seedArgs?: string;
  documents: number;
  repeatFactor: number;
  warmupRuns: number;
  measuredRuns: number;
  profiles: BenchmarkProfileResult[];
};

type HistoryConfig = {
  outputPath: string;
  runsDir: string;
  historyWindow: number;
};

type ProfileHistorySummary = {
  name: string;
  latestAvgMs: number;
  latestP95Ms: number;
  latestThroughput: number;
  recentAvgMs: number;
  recentP95Ms: number;
  recentThroughput: number;
  allAvgMs: number;
  allP95Ms: number;
  allThroughput: number;
};

const DEFAULT_CONFIG: BenchmarkConfig = {
  vaultPath: path.resolve(process.cwd(), '.temp', 'test-data', 'benchmark-vault'),
  repeatFactor: 1,
  warmupRuns: 3,
  measuredRuns: 10,
};

const DEFAULT_HISTORY_WINDOW = 5;

function readPositiveInteger(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readPositiveIntegerOption(optionName: string, envName: string, fallback: number): number {
  const npmConfigValue = process.env[`npm_config_${optionName}`];
  if (npmConfigValue) {
    const parsed = Number.parseInt(npmConfigValue, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return readPositiveInteger(envName, fallback);
}

function getConfig(): BenchmarkConfig {
  return {
    vaultPath: process.env.PIPELINE_BENCH_VAULT?.trim() || DEFAULT_CONFIG.vaultPath,
    repeatFactor: readPositiveIntegerOption('repeat', 'PIPELINE_BENCH_REPEAT', DEFAULT_CONFIG.repeatFactor),
    warmupRuns: readPositiveIntegerOption('warmups', 'PIPELINE_BENCH_WARMUPS', DEFAULT_CONFIG.warmupRuns),
    measuredRuns: readPositiveIntegerOption('runs', 'PIPELINE_BENCH_RUNS', DEFAULT_CONFIG.measuredRuns),
  };
}

function collectMarkdownFiles(directory: string): string[] {
  const markdownFiles: string[] = [];
  const entries = readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === '.obsidian') {
      continue;
    }

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      markdownFiles.push(...collectMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      markdownFiles.push(fullPath);
    }
  }

  return markdownFiles;
}

function createDocuments(vaultPath: string, repeatFactor: number): PipelineDocument[] {
  const markdownFiles = collectMarkdownFiles(vaultPath);
  const documents: PipelineDocument[] = [];
  const safeRepeat = Math.max(1, repeatFactor);

  for (const filePath of markdownFiles) {
    const rawText = readFileSync(filePath, 'utf8');
    const relativePath = path.relative(vaultPath, filePath);
    const basename = path.basename(filePath, '.md');

    for (let copyIndex = 0; copyIndex < safeRepeat; copyIndex += 1) {
      const suffix = safeRepeat > 1 ? `#${copyIndex + 1}` : '';
      const idPath = relativePath.replace(/\\/g, '/');
      const id = `${idPath}${suffix}`;
      const pipelinePath = suffix.length > 0 ? `${idPath}${suffix}` : idPath;

      documents.push({
        id,
        path: pipelinePath,
        basename,
        rawText,
        tags: [],
        frontmatter: {},
      });
    }
  }

  if (documents.length === 0) {
    throw new Error(`No markdown files found in benchmark vault: ${vaultPath}`);
  }

  return documents;
}

function runOnce(documents: PipelineDocument[], nlpSettings: NlpSettings): void {
  const result = runTransformPipeline({
    documents,
    stopWords: new Set(DEFAULT_SETTINGS.exclusionListWords),
    minWordLength: DEFAULT_SETTINGS.filters.minWordLength,
    renderSettings: { ...DEFAULT_SETTINGS.render },
    nlpSettings,
  });

  expect(result.totalTokens).toBeGreaterThan(0);
  expect(result.wordCloudWords.length).toBeGreaterThan(0);
}

function toMilliseconds(durationNs: bigint): number {
  return Number(durationNs) / 1_000_000;
}

function percentile(sortedValues: number[], p: number): number {
  const index = Math.ceil(sortedValues.length * p) - 1;
  const safeIndex = Math.min(Math.max(index, 0), sortedValues.length - 1);
  return sortedValues[safeIndex] ?? 0;
}

function writeBenchmarkResults(markdown: string): void {
  const outputPath = getHistoryConfig().outputPath;
  const resolvedOutputPath = path.resolve(process.cwd(), outputPath);
  mkdirSync(path.dirname(resolvedOutputPath), { recursive: true });
  writeFileSync(resolvedOutputPath, `${markdown}\n`, 'utf8');
}

function getHistoryConfig(): HistoryConfig {
  const outputPath = process.env.PIPELINE_BENCH_OUTPUT?.trim() || '.temp/benchmarks/pipeline-results.md';
  const runsDir = process.env.PIPELINE_BENCH_RUNS_DIR?.trim() || '.temp/benchmarks/runs';
  const historyWindow = readPositiveIntegerOption('history', 'PIPELINE_BENCH_HISTORY_WINDOW', DEFAULT_HISTORY_WINDOW);

  return {
    outputPath,
    runsDir,
    historyWindow,
  };
}

function toFixed(value: number): string {
  return value.toFixed(2);
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function readRunRecords(runsDir: string): BenchmarkRunRecord[] {
  const resolvedRunsDir = path.resolve(process.cwd(), runsDir);
  if (!existsSync(resolvedRunsDir)) {
    return [];
  }

  const files = readdirSync(resolvedRunsDir)
    .filter((file) => file.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b));

  const records: BenchmarkRunRecord[] = [];
  for (const file of files) {
    const fullPath = path.join(resolvedRunsDir, file);
    const raw = readFileSync(fullPath, 'utf8');
    const parsed = JSON.parse(raw) as BenchmarkRunRecord;
    if (Array.isArray(parsed.profiles) && typeof parsed.epochMs === 'number') {
      records.push(parsed);
    }
  }

  return records;
}

function getHistorySummary(latestRun: BenchmarkRunRecord, allRuns: BenchmarkRunRecord[], historyWindow: number): {
  recentRunsCount: number;
  rows: ProfileHistorySummary[];
} {
  const recentRuns = allRuns.slice(-Math.max(1, historyWindow));
  const profileNames = latestRun.profiles.map((profile) => profile.name);
  const rows: ProfileHistorySummary[] = [];

  for (const profileName of profileNames) {
    const latestProfile = latestRun.profiles.find((profile) => profile.name === profileName);
    if (!latestProfile) {
      continue;
    }

    const recentProfiles = recentRuns
      .map((run) => run.profiles.find((profile) => profile.name === profileName))
      .filter((profile): profile is BenchmarkProfileResult => profile !== undefined);
    const allProfiles = allRuns
      .map((run) => run.profiles.find((profile) => profile.name === profileName))
      .filter((profile): profile is BenchmarkProfileResult => profile !== undefined);

    const recentAvgMs = average(recentProfiles.map((profile) => profile.avgMs));
    const recentP95Ms = average(recentProfiles.map((profile) => profile.p95Ms));
    const recentThroughput = average(recentProfiles.map((profile) => profile.throughputDocsPerSecond));
    const allAvgMs = average(allProfiles.map((profile) => profile.avgMs));
    const allP95Ms = average(allProfiles.map((profile) => profile.p95Ms));
    const allThroughput = average(allProfiles.map((profile) => profile.throughputDocsPerSecond));

    rows.push({
      name: profileName,
      latestAvgMs: latestProfile.avgMs,
      latestP95Ms: latestProfile.p95Ms,
      latestThroughput: latestProfile.throughputDocsPerSecond,
      recentAvgMs,
      recentP95Ms,
      recentThroughput,
      allAvgMs,
      allP95Ms,
      allThroughput,
    });
  }

  return {
    recentRunsCount: recentRuns.length,
    rows,
  };
}

function buildMarkdownReport(run: BenchmarkRunRecord, allRuns: BenchmarkRunRecord[], historyWindow: number): string {
  const generatedAt = new Date(run.epochMs).toISOString();
  const history = getHistorySummary(run, allRuns, historyWindow);
  const lines: string[] = [];

  lines.push('# Pipeline benchmark report');
  lines.push('');
  lines.push(`Generated: ${generatedAt}`);
  lines.push(`Run id: ${run.runId}`);
  lines.push('');
  lines.push('## Run configuration');
  lines.push('');
  lines.push('| Setting | Value |');
  lines.push('| --- | --- |');
  lines.push(`| Vault path | \`${run.vaultPath}\` |`);
  lines.push(`| Seed options | \`${run.seedArgs || '(default profiles)'}\` |`);
  lines.push(`| Documents | ${run.documents} |`);
  lines.push(`| Repeat factor | ${run.repeatFactor} |`);
  lines.push(`| Warmup runs | ${run.warmupRuns} |`);
  lines.push(`| Measured runs | ${run.measuredRuns} |`);
  lines.push('');
  lines.push('## Latest run metrics');
  lines.push('');
  lines.push('| Profile | Min (ms) | Avg (ms) | P95 (ms) | Max (ms) | Throughput (docs/sec) |');
  lines.push('| --- | ---: | ---: | ---: | ---: | ---: |');
  for (const profile of run.profiles) {
    lines.push(`| ${profile.name} | ${toFixed(profile.minMs)} | ${toFixed(profile.avgMs)} | ${toFixed(profile.p95Ms)} | ${toFixed(profile.maxMs)} | ${toFixed(profile.throughputDocsPerSecond)} |`);
  }
  lines.push('');
  lines.push('## History summary');
  lines.push('');
  lines.push(`Stored runs: ${allRuns.length}`);
  lines.push(`Averaging window: last ${history.recentRunsCount} run(s)`);
  lines.push('');
  lines.push('| Profile | Latest avg (ms) | Latest p95 (ms) | Latest throughput | Avg last N avg (ms) | Avg last N p95 (ms) | Avg last N throughput | Avg all avg (ms) | Avg all p95 (ms) | Avg all throughput |');
  lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const row of history.rows) {
    lines.push(`| ${row.name} | ${toFixed(row.latestAvgMs)} | ${toFixed(row.latestP95Ms)} | ${toFixed(row.latestThroughput)} | ${toFixed(row.recentAvgMs)} | ${toFixed(row.recentP95Ms)} | ${toFixed(row.recentThroughput)} | ${toFixed(row.allAvgMs)} | ${toFixed(row.allP95Ms)} | ${toFixed(row.allThroughput)} |`);
  }
  lines.push('');
  lines.push('## All stored runs');
  lines.push('');
  lines.push('| Run id | Generated (UTC) | Profile | Seed options | Docs | Repeat | Warmups | Runs | Avg (ms) | P95 (ms) | Throughput (docs/sec) |');
  lines.push('| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');

  const runsNewestFirst = [...allRuns].sort((a, b) => b.epochMs - a.epochMs);
  for (const storedRun of runsNewestFirst) {
    const generated = new Date(storedRun.epochMs).toISOString();
    const seedOptions = storedRun.seedArgs?.trim() ? storedRun.seedArgs : '(default profiles)';

    for (const profile of storedRun.profiles) {
      lines.push(
        `| ${storedRun.runId} | ${generated} | ${profile.name} | \`${seedOptions}\` | ${storedRun.documents} | ${storedRun.repeatFactor} | ${storedRun.warmupRuns} | ${storedRun.measuredRuns} | ${toFixed(profile.avgMs)} | ${toFixed(profile.p95Ms)} | ${toFixed(profile.throughputDocsPerSecond)} |`,
      );
    }
  }

  return lines.join('\n');
}

function persistRunRecord(run: BenchmarkRunRecord): BenchmarkRunRecord[] {
  const { runsDir } = getHistoryConfig();
  const resolvedRunsDir = path.resolve(process.cwd(), runsDir);
  mkdirSync(resolvedRunsDir, { recursive: true });
  const runPath = path.join(resolvedRunsDir, `${run.epochMs}.json`);
  writeFileSync(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');

  return readRunRecords(runsDir);
}

describe('pipeline benchmark harness', () => {
  jest.setTimeout(120_000);

  it('reports pipeline throughput using benchmark seed markdown files', () => {
    const config = getConfig();
    const documents = createDocuments(config.vaultPath, config.repeatFactor);
    const profileResults: BenchmarkProfileResult[] = [];

    const log = (line: string): void => {
      console.info(line);
    };

    const profiles: Array<{ name: string; nlpSettings: NlpSettings }> = [
      {
        name: 'NLP off',
        nlpSettings: { ...DEFAULT_SETTINGS.filters.nlp },
      },
      {
        name: 'NLP light',
        nlpSettings: {
          ...DEFAULT_SETTINGS.filters.nlp,
          enabled: true,
          mode: 'light',
        },
      },
    ];

    log('Pipeline benchmark results');
    log(`- Vault path: ${config.vaultPath}`);
    log(`- Documents: ${documents.length}`);
    log(`- Repeat factor: ${config.repeatFactor}`);
    log(`- Warmup runs: ${config.warmupRuns}`);
    log(`- Measured runs: ${config.measuredRuns}`);

    for (const profile of profiles) {
      for (let run = 0; run < config.warmupRuns; run += 1) {
        runOnce(documents, profile.nlpSettings);
      }

      const timingsMs: number[] = [];
      for (let run = 0; run < config.measuredRuns; run += 1) {
        const start = process.hrtime.bigint();
        runOnce(documents, profile.nlpSettings);
        const end = process.hrtime.bigint();
        timingsMs.push(toMilliseconds(end - start));
      }

      const sortedTimings = [...timingsMs].sort((a, b) => a - b);
      const totalMs = timingsMs.reduce((sum, value) => sum + value, 0);
      const averageMs = totalMs / timingsMs.length;
      const minMs = sortedTimings[0] ?? 0;
      const p95Ms = percentile(sortedTimings, 0.95);
      const maxMs = sortedTimings[sortedTimings.length - 1] ?? 0;
      const docsPerSecond = (documents.length / averageMs) * 1000;
      profileResults.push({
        name: profile.name,
        minMs,
        avgMs: averageMs,
        p95Ms,
        maxMs,
        throughputDocsPerSecond: docsPerSecond,
      });

      log(`- ${profile.name}:`);
      log(`  min: ${minMs.toFixed(2)} ms`);
      log(`  avg: ${averageMs.toFixed(2)} ms`);
      log(`  p95: ${p95Ms.toFixed(2)} ms`);
      log(`  max: ${maxMs.toFixed(2)} ms`);
      log(`  throughput: ${docsPerSecond.toFixed(2)} docs/sec`);
    }

    const epochMs = Date.now();
    const runRecord: BenchmarkRunRecord = {
      epochMs,
      runId: String(epochMs),
      vaultPath: config.vaultPath,
      seedArgs: process.env.PIPELINE_BENCH_SEED_ARGS?.trim() || '',
      documents: documents.length,
      repeatFactor: config.repeatFactor,
      warmupRuns: config.warmupRuns,
      measuredRuns: config.measuredRuns,
      profiles: profileResults,
    };
    const allRuns = persistRunRecord(runRecord);
    const historyConfig = getHistoryConfig();
    const markdownReport = buildMarkdownReport(runRecord, allRuns, historyConfig.historyWindow);
    writeBenchmarkResults(markdownReport);
  });
});
