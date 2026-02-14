import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const manifestPath = path.join(projectRoot, 'manifest.json');

if (!existsSync(manifestPath)) {
  console.error('manifest.json not found in current directory.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const pluginId = manifest.id;
if (typeof pluginId !== 'string' || pluginId.length === 0) {
  console.error('manifest.json is missing a valid "id".');
  process.exit(1);
}

const cliTargetPath = process.argv[2];
const envTargetPath = process.env.OBSIDIAN_VAULT_PATH;
const targetPath = cliTargetPath ?? envTargetPath;

if (!targetPath) {
  console.error(
    [
      'Missing target path.',
      'Usage: npm run deploy -- /absolute/path/to/your/vault',
      '   or: npm run deploy -- /absolute/path/to/your/vault/.obsidian/plugins/<plugin-id>',
      'Or set OBSIDIAN_VAULT_PATH to either of those paths.',
    ].join('\n')
  );
  process.exit(1);
}

const normalizedTarget = path.normalize(targetPath);
const expectedTail = path.normalize(path.join('.obsidian', 'plugins', pluginId));
const pluginDir = normalizedTarget.endsWith(expectedTail)
  ? normalizedTarget
  : path.join(normalizedTarget, '.obsidian', 'plugins', pluginId);
const filesToCopy = ['manifest.json', 'main.js', 'styles.css'];
const distDir = path.join(projectRoot, 'dist');

console.log('Building plugin...');
execSync('npm run build', { stdio: 'inherit' });

mkdirSync(pluginDir, { recursive: true });

for (const filename of filesToCopy) {
  const source = path.join(distDir, filename);
  if (!existsSync(source)) {
    console.error(`Expected file not found: ${source}`);
    process.exit(1);
  }

  const destination = path.join(pluginDir, filename);
  copyFileSync(source, destination);
  console.log(`Copied ${filename} -> ${destination}`);
}

console.log('Deploy complete.');
