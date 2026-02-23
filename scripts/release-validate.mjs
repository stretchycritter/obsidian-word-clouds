import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function fail(message) {
  console.error(`Release validation failed: ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function assertNonEmptyFile(filePath) {
  let stats;
  try {
    stats = statSync(filePath);
  } catch {
    fail(`required artifact is missing: ${filePath}`);
  }

  if (!stats.isFile() || stats.size === 0) {
    fail(`required artifact is empty or invalid: ${filePath}`);
  }
}

const inputTag = process.argv[2]?.trim();
if (!inputTag) {
  fail('missing tag argument. Usage: npm run release:validate -- <tag>');
}

const projectRoot = process.cwd();
const manifestPath = path.join(projectRoot, 'manifest.json');
const packageJsonPath = path.join(projectRoot, 'package.json');
const versionsPath = path.join(projectRoot, 'versions.json');
const distDir = path.join(projectRoot, 'dist');

const manifest = readJson(manifestPath);
const packageJson = readJson(packageJsonPath);
const versions = readJson(versionsPath);

const manifestVersion = String(manifest.version ?? '').trim();
const normalizedTag = inputTag.startsWith('v') ? inputTag.slice(1) : inputTag;

if (normalizedTag !== manifestVersion) {
  fail(
    `tag (${inputTag}) must match manifest.json version (${manifestVersion}); accepted formats: ${manifestVersion} or v${manifestVersion}.`,
  );
}

if (String(packageJson.version ?? '').trim() !== manifestVersion) {
  fail(`package.json version (${packageJson.version}) must match manifest.json version (${manifestVersion}).`);
}

const isBeta = manifestVersion.includes('-');
const mappedMinAppVersion = versions[manifestVersion];
if (!isBeta) {
  if (!mappedMinAppVersion) {
    fail(`versions.json must include an entry for ${manifestVersion}.`);
  }

  if (mappedMinAppVersion !== manifest.minAppVersion) {
    fail(
      `versions.json maps ${manifestVersion} to ${mappedMinAppVersion}, but manifest.json minAppVersion is ${manifest.minAppVersion}.`,
    );
  }
}

assertNonEmptyFile(path.join(distDir, 'manifest.json'));
assertNonEmptyFile(path.join(distDir, 'main.js'));
assertNonEmptyFile(path.join(distDir, 'styles.css'));

console.log(`Release validation passed for ${inputTag}.`);
