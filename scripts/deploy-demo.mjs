import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
export function deployToDemoVault() {
  const manifestPath = path.join(projectRoot, 'manifest.json');
  if (!existsSync(manifestPath)) {
    throw new Error('manifest.json not found in project root.');
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const pluginId = manifest.id;
  if (typeof pluginId !== 'string' || pluginId.length === 0) {
    throw new Error('manifest.json is missing a valid "id".');
  }

  const distDir = path.join(projectRoot, 'dist');
  const pluginDir = path.join(projectRoot, 'demo-vault', '.obsidian', 'plugins', pluginId);
  const filesToCopy = ['manifest.json', 'main.js', 'styles.css'];

  mkdirSync(pluginDir, { recursive: true });

  for (const filename of filesToCopy) {
    const source = path.join(distDir, filename);
    if (!existsSync(source)) {
      throw new Error(`Expected build file not found: ${source}`);
    }

    const destination = path.join(pluginDir, filename);
    copyFileSync(source, destination);
    console.log(`Copied ${filename} -> ${destination}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    deployToDemoVault();
    console.log('Demo vault deploy complete.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    console.error('Run "npm run build" first, or use "npm run build:demo".');
    process.exit(1);
  }
}
