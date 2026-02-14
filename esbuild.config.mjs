import esbuild from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import process from 'process';

const production = process.argv[2] === 'production';
const distDir = path.join(process.cwd(), 'dist');

function copyStaticFiles() {
  mkdirSync(distDir, { recursive: true });
  copyFileSync(path.join(process.cwd(), 'manifest.json'), path.join(distDir, 'manifest.json'));
  copyFileSync(path.join(process.cwd(), 'src', 'styles.css'), path.join(distDir, 'styles.css'));
}

const context = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: ['obsidian', 'electron', '@codemirror/*'],
  format: 'cjs',
  target: 'es2020',
  logLevel: 'info',
  sourcemap: production ? false : 'inline',
  treeShaking: true,
  outfile: 'dist/main.js'
});

if (production) {
  await context.rebuild();
  copyStaticFiles();
  await context.dispose();
} else {
  copyStaticFiles();
  await context.watch();
}
