import esbuild from 'esbuild';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'process';

const mode = process.argv[2] ?? 'dev';
const isRelease = mode === 'release';
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
  const stylesPath = path.join(process.cwd(), 'src', 'styles.css');
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
  sourcemap: isRelease ? false : 'inline',
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

if (isRelease) {
  await context.rebuild();
  await context.dispose();
} else {
  await context.watch();
}
