import { runTransformPipeline } from '@/core/pipeline';
import type { PipelineDocument } from '@/core';
import { DEFAULT_SETTINGS } from '@/settings/constants';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

type BenchmarkConfig = {
  vaultPath: string;
  repeatFactor: number;
  warmupRuns: number;
  measuredRuns: number;
};

const DEFAULT_CONFIG: BenchmarkConfig = {
  vaultPath: path.resolve(process.cwd(), 'demo-vault'),
  repeatFactor: 1,
  warmupRuns: 3,
  measuredRuns: 10,
};

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

function runOnce(documents: PipelineDocument[]): void {
  const result = runTransformPipeline({
    documents,
    stopWords: new Set(DEFAULT_SETTINGS.exclusionListWords),
    minWordLength: DEFAULT_SETTINGS.filters.minWordLength,
    renderSettings: { ...DEFAULT_SETTINGS.render },
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

function writeBenchmarkResults(lines: string[]): void {
  const outputPath = process.env.PIPELINE_BENCH_OUTPUT?.trim();
  if (!outputPath) {
    return;
  }

  writeFileSync(path.resolve(process.cwd(), outputPath), `${lines.join('\n')}\n`, 'utf8');
}

describe('pipeline benchmark harness', () => {
  jest.setTimeout(120_000);

  it('reports pipeline throughput using demo-vault markdown files', () => {
    const config = getConfig();
    const documents = createDocuments(config.vaultPath, config.repeatFactor);
    const outputLines: string[] = [];

    const log = (line: string): void => {
      outputLines.push(line);
      console.info(line);
    };

    for (let run = 0; run < config.warmupRuns; run += 1) {
      runOnce(documents);
    }

    const timingsMs: number[] = [];
    for (let run = 0; run < config.measuredRuns; run += 1) {
      const start = process.hrtime.bigint();
      runOnce(documents);
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

    log('Pipeline benchmark results');
    log(`- Vault path: ${config.vaultPath}`);
    log(`- Documents: ${documents.length}`);
    log(`- Repeat factor: ${config.repeatFactor}`);
    log(`- Warmup runs: ${config.warmupRuns}`);
    log(`- Measured runs: ${config.measuredRuns}`);
    log(`- min: ${minMs.toFixed(2)} ms`);
    log(`- avg: ${averageMs.toFixed(2)} ms`);
    log(`- p95: ${p95Ms.toFixed(2)} ms`);
    log(`- max: ${maxMs.toFixed(2)} ms`);
    log(`- throughput: ${docsPerSecond.toFixed(2)} docs/sec`);
    writeBenchmarkResults(outputLines);
  });
});
