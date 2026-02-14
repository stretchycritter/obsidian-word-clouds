import { spawn } from 'node:child_process';
import { watchFile, unwatchFile } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deployToDemoVault } from './deploy-demo.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const distDir = path.join(projectRoot, 'dist');
const watchedFiles = ['main.js', 'manifest.json', 'styles.css'];

let deployInProgress = false;
let deployQueued = false;
let debounceTimer;

function deploy(reason) {
  if (deployInProgress) {
    deployQueued = true;
    return;
  }

  deployInProgress = true;
  try {
    deployToDemoVault();
    console.log(`Deployed to demo vault (${reason}).`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Deploy failed (${reason}): ${message}`);
  } finally {
    deployInProgress = false;
    if (deployQueued) {
      deployQueued = false;
      deploy('queued changes');
    }
  }
}

function scheduleDeploy(reason) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    deploy(reason);
  }, 120);
}

function startDistPolling() {
  for (const filename of watchedFiles) {
    const filePath = path.join(distDir, filename);
    watchFile(filePath, { interval: 250 }, (curr, prev) => {
      if (curr.mtimeMs === 0) {
        return;
      }
      if (curr.mtimeMs !== prev.mtimeMs) {
        scheduleDeploy(`dist update: ${filename}`);
      }
    });
  }
}

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
startDistPolling();

const dev = spawn(npmCmd, ['run', 'dev'], {
  cwd: projectRoot,
  stdio: 'inherit',
});

dev.on('error', (error) => {
  console.error(`Failed to start dev watcher: ${error.message}`);
  process.exit(1);
});

dev.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGINT', () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  for (const filename of watchedFiles) {
    unwatchFile(path.join(distDir, filename));
  }
  dev.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  for (const filename of watchedFiles) {
    unwatchFile(path.join(distDir, filename));
  }
  dev.kill('SIGTERM');
  process.exit(0);
});
