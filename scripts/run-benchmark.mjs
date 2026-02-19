import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const benchmarkEnv = { ...process.env };
const passthroughArgs = [];
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('--runs=')) {
    benchmarkEnv.PIPELINE_BENCH_RUNS = arg.split('=')[1] ?? '';
    continue;
  }
  if (arg.startsWith('--warmups=')) {
    benchmarkEnv.PIPELINE_BENCH_WARMUPS = arg.split('=')[1] ?? '';
    continue;
  }
  if (arg.startsWith('--repeat=')) {
    benchmarkEnv.PIPELINE_BENCH_REPEAT = arg.split('=')[1] ?? '';
    continue;
  }
  if (arg.startsWith('--history=')) {
    benchmarkEnv.PIPELINE_BENCH_HISTORY_WINDOW = arg.split('=')[1] ?? '';
    continue;
  }

  passthroughArgs.push(arg);
}

const seedArgs = [
  'scripts/generate-test-data.mjs',
  '--output-dir=.temp/test-data/benchmark-vault',
  '--file-prefix=benchmark-test-data',
  ...passthroughArgs,
];

benchmarkEnv.PIPELINE_BENCH_SEED_ARGS = passthroughArgs.join(' ');

const seedResult = spawnSync('node', seedArgs, {
  cwd: projectRoot,
  stdio: 'inherit',
});

if ((seedResult.status ?? 1) !== 0) {
  process.exit(seedResult.status ?? 1);
}

const benchmarkResult = spawnSync(npmCmd, ['run', 'benchmark:run'], {
  cwd: projectRoot,
  env: benchmarkEnv,
  stdio: 'inherit',
});

process.exit(benchmarkResult.status ?? 1);
