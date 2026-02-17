import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const VALID_LEVELS = new Set(['major', 'minor', 'patch']);

function fail(message) {
  console.error(`Version bump failed: ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, content) {
  writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`);
}

function parseSemver(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    fail(`invalid SemVer "${version}". Expected x.y.z.`);
  }

  return {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2], 10),
    patch: Number.parseInt(match[3], 10),
  };
}

function bumpVersion(version, level) {
  const parsed = parseSemver(version);
  if (level === 'major') {
    return `${parsed.major + 1}.0.0`;
  }
  if (level === 'minor') {
    return `${parsed.major}.${parsed.minor + 1}.0`;
  }
  return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
}

const level = process.argv[2]?.trim();
if (!level || !VALID_LEVELS.has(level)) {
  fail('usage: npm run version:bump -- <major|minor|patch>');
}

const projectRoot = process.cwd();
const manifestPath = path.join(projectRoot, 'manifest.json');
const packageJsonPath = path.join(projectRoot, 'package.json');
const packageLockPath = path.join(projectRoot, 'package-lock.json');
const versionsPath = path.join(projectRoot, 'versions.json');

const manifest = readJson(manifestPath);
const packageJson = readJson(packageJsonPath);
const packageLock = readJson(packageLockPath);
const versions = readJson(versionsPath);

const currentVersion = String(manifest.version ?? '').trim();
const packageVersion = String(packageJson.version ?? '').trim();

if (currentVersion !== packageVersion) {
  fail(`manifest.json version (${currentVersion}) does not match package.json version (${packageVersion}).`);
}

const nextVersion = bumpVersion(currentVersion, level);

manifest.version = nextVersion;
packageJson.version = nextVersion;
packageLock.version = nextVersion;
if (packageLock.packages && packageLock.packages['']) {
  packageLock.packages[''].version = nextVersion;
}

versions[nextVersion] = manifest.minAppVersion;

writeJson(manifestPath, manifest);
writeJson(packageJsonPath, packageJson);
writeJson(packageLockPath, packageLock);
writeJson(versionsPath, versions);

process.stdout.write(nextVersion);
