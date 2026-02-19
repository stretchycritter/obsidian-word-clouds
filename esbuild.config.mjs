import esbuild from 'esbuild';
import { copyFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'process';

const mode = process.argv[2] ?? 'watch';
if (!['dev', 'watch', 'watch-release', 'release'].includes(mode)) {
  throw new Error(`Unknown build mode "${mode}". Use dev, watch, watch-release, or release.`);
}
const isRelease = mode === 'release' || mode === 'watch-release';
const isWatch = mode === 'watch' || mode === 'watch-release';
const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const manifestPath = path.join(projectRoot, 'manifest.json');
const packageJsonPath = path.join(projectRoot, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const demoVaultPluginDir = path.join(projectRoot, 'demo-vault', '.obsidian', 'plugins', manifest.id);
const buildYear = new Date().getFullYear();
const bannerText = `/*!\n * ${packageJson.name} v${packageJson.version}\n * Copyright (c) ${buildYear} ${packageJson.author ?? 'Contributors'}\n * Licensed under ${packageJson.license}. See LICENSE.\n */`;

function copyBuiltPluginFiles(targetDir, includeSourceMap) {
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(path.join(distDir, 'main.js'), path.join(targetDir, 'main.js'));
  copyFileSync(manifestPath, path.join(targetDir, 'manifest.json'));
  copyFileSync(path.join(distDir, 'styles.css'), path.join(targetDir, 'styles.css'));
  copyFileSync(path.join(projectRoot, 'LICENSE'), path.join(targetDir, 'LICENSE'));
  copyFileSync(path.join(projectRoot, 'THIRD_PARTY_NOTICES.md'), path.join(targetDir, 'THIRD_PARTY_NOTICES.md'));

  const sourceMapPath = path.join(distDir, 'main.js.map');
  const targetSourceMapPath = path.join(targetDir, 'main.js.map');
  if (includeSourceMap && existsSync(sourceMapPath)) {
    copyFileSync(sourceMapPath, targetSourceMapPath);
  } else if (existsSync(targetSourceMapPath)) {
    unlinkSync(targetSourceMapPath);
  }
}

function copyStaticFiles() {
  mkdirSync(distDir, { recursive: true });
  if (isRelease) {
    const sourceMapPath = path.join(distDir, 'main.js.map');
    if (existsSync(sourceMapPath)) {
      unlinkSync(sourceMapPath);
    }
  }

  const stylesPath = path.join(projectRoot, 'src', 'ui', 'styles.css');
  const stylesOutput = isRelease
    ? esbuild.transformSync(readFileSync(stylesPath, 'utf8'), {
        loader: 'css',
        minify: true,
        legalComments: 'eof',
      }).code
    : readFileSync(stylesPath, 'utf8');

  copyFileSync(manifestPath, path.join(distDir, 'manifest.json'));
  writeFileSync(path.join(distDir, 'styles.css'), stylesOutput);
  copyFileSync(path.join(projectRoot, 'LICENSE'), path.join(distDir, 'LICENSE'));
  copyFileSync(path.join(projectRoot, 'THIRD_PARTY_NOTICES.md'), path.join(distDir, 'THIRD_PARTY_NOTICES.md'));
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
  define: {
    __DEV_BUILD__: JSON.stringify(!isRelease),
  },
  outfile: 'dist/main.js',
  plugins: [
    {
      name: 'copy-static-files',
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length === 0) {
            copyStaticFiles();
            if (isWatch) {
              copyBuiltPluginFiles(demoVaultPluginDir, !isRelease);
            }
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
