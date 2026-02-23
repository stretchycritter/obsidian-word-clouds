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

function bumpVersion(version, level, isBeta = false) {
  const parsed = parseSemver(version);
  let bumped;
  if (level === 'major') {
    bumped = `${parsed.major + 1}.0.0`;
  } else if (level === 'minor') {
    bumped = `${parsed.major}.${parsed.minor + 1}.0`;
  } else {
    bumped = `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
  }

  return isBeta ? `${bumped}-beta` : bumped;
}

const level = process.argv[2]?.trim();
const isBeta = process.argv[3]?.trim() === 'beta';
if (!level || !VALID_LEVELS.has(level)) {
  fail('usage: npm run version:bump -- <major|minor|patch> [beta]');
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

// For beta releases, use the last released version as the base
let baseVersion = currentVersion;
if (isBeta) {
  const versionKeys = Object.keys(versions)
    .filter(v => !v.includes('-beta') && v.match(/^\d+\.\d+\.\d+$/))
    .sort((a, b) => {
      const aParts = a.split('.').map(Number);
      const bParts = b.split('.').map(Number);
      for (let i = 0; i < 3; i++) {
        if (aParts[i] !== bParts[i]) {
          return bParts[i] - aParts[i];
        }
      }
      return 0;
    });
  if (versionKeys.length > 0) {
    baseVersion = versionKeys[0];
  }
}

const nextVersion = bumpVersion(baseVersion, level, isBeta);

manifest.version = nextVersion;
packageJson.version = nextVersion;
packageLock.version = nextVersion;
if (packageLock.packages && packageLock.packages['']) {
  packageLock.packages[''].version = nextVersion;
}

// Always update manifest/package files so the build and validation use the new version.
// For stable releases, also record the version in versions.json.
writeJson(manifestPath, manifest);
writeJson(packageJsonPath, packageJson);
writeJson(packageLockPath, packageLock);
if (!isBeta) {
  versions[nextVersion] = manifest.minAppVersion;
  writeJson(versionsPath, versions);
}

process.stdout.write(nextVersion);
