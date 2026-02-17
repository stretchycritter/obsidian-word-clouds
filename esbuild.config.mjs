import esbuild from 'esbuild';
import { copyFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'process';

const mode = process.argv[2] ?? 'watch';
if (!['dev', 'watch', 'release'].includes(mode)) {
  throw new Error(`Unknown build mode "${mode}". Use dev, watch, or release.`);
}
const isRelease = mode === 'release';
const isWatch = mode === 'watch';
const distDir = path.join(process.cwd(), 'dist');
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const buildYear = new Date().getFullYear();
const bannerText = `/*!
 * ${packageJson.name} v${packageJson.version}
 * Copyright (c) ${buildYear} ${packageJson.author ?? 'Contributors'}
 * Licensed under ${packageJson.license}. See LICENSE.
 */`;

function copyStaticFiles() {
  mkdirSync(distDir, { recursive: true });
  if (isRelease) {
    const sourceMapPath = path.join(distDir, 'main.js.map');
    if (existsSync(sourceMapPath)) {
      unlinkSync(sourceMapPath);
    }
  }

  const stylesPath = path.join(process.cwd(), 'src', 'ui', 'styles.css');
  const stylesOutput = isRelease
    ? esbuild.transformSync(readFileSync(stylesPath, 'utf8'), {
        loader: 'css',
        minify: true,
        legalComments: 'eof',
      }).code
    : readFileSync(stylesPath, 'utf8');

  copyFileSync(path.join(process.cwd(), 'manifest.json'), path.join(distDir, 'manifest.json'));
  writeFileSync(path.join(distDir, 'styles.css'), stylesOutput);
  copyFileSync(path.join(process.cwd(), 'LICENSE'), path.join(distDir, 'LICENSE'));
  copyFileSync(path.join(process.cwd(), 'THIRD_PARTY_NOTICES.md'), path.join(distDir, 'THIRD_PARTY_NOTICES.md'));
}

const context = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: ['obsidian', 'electron', '@codemirror/*'],
  format: 'cjs',
  target: 'es2020',
  logLevel: 'info',
  sourcemap: isRelease ? false : 'external',
  minify: isRelease,
  legalComments: isRelease ? 'eof' : 'none',
  banner: isRelease ? { js: bannerText } : undefined,
  treeShaking: true,
  outfile: 'dist/main.js',
  plugins: [
    {
      name: 'copy-static-files',
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length === 0) {
            copyStaticFiles();
          }
        });
      },
    },
  ],
});

if (isWatch) {
  await context.watch();
} else {
  await context.rebuild();
  await context.dispose();
}
