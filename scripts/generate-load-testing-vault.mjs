import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_PROFILES = [
  { label: 'small', count: 30, minWords: 80, maxWords: 180 },
  { label: 'medium', count: 20, minWords: 450, maxWords: 900 },
  { label: 'large', count: 10, minWords: 2200, maxWords: 4200 },
];

const DEFAULT_WORD_BANK = {
  nouns: [
    'architecture', 'plugin', 'vault', 'note', 'render', 'token', 'query', 'pipeline', 'settings', 'filter',
    'analysis', 'experiment', 'performance', 'benchmark', 'result', 'layout', 'scaling', 'frequency', 'workflow',
    'metadata', 'storage', 'snapshot', 'dataset', 'component', 'canvas', 'distribution', 'cluster', 'iteration',
    'throughput', 'latency', 'memory', 'surface', 'strategy', 'schema', 'profile', 'index', 'summary', 'planning',
    'capture', 'search', 'relevance', 'insight', 'project', 'roadmap', 'release', 'quality', 'review', 'section',
    'paragraph', 'heading', 'context', 'signal', 'corpus', 'document', 'folder', 'tag', 'frontmatter', 'journal',
    'backlog', 'milestone', 'ticket', 'prototype', 'changelog', 'alert', 'dashboard', 'incident', 'playbook',
    'checklist', 'objective', 'timeline', 'dependency', 'artifact', 'pattern', 'heuristic', 'throttle', 'cache',
    'payload', 'adapter', 'orchestrator', 'controller', 'endpoint', 'notebook', 'appendix', 'hypothesis',
  ],
  verbs: [
    'analyze', 'compose', 'render', 'filter', 'aggregate', 'benchmark', 'profile', 'optimize', 'compare',
    'capture', 'trace', 'measure', 'summarize', 'normalize', 'tokenize', 'schedule', 'refine', 'inspect',
    'validate', 'segment', 'categorize', 'prioritize', 'simulate', 'document', 'review', 'publish', 'archive',
    'synchronize', 'reconcile', 'stabilize', 'streamline', 'forecast', 'iterate', 'package', 'dispatch',
  ],
  adjectives: [
    'adaptive', 'stable', 'volatile', 'deterministic', 'dynamic', 'incremental', 'scalable', 'asynchronous',
    'predictive', 'semantic', 'granular', 'modular', 'holistic', 'robust', 'sparse', 'dense', 'iterative',
    'contextual', 'stateless', 'stateful', 'balanced', 'aggressive', 'lightweight', 'resilient', 'portable',
    'composable', 'latent', 'observable', 'prioritized', 'detached', 'coupled', 'isolated',
  ],
  domains: [
    'research', 'biology', 'finance', 'history', 'linguistics', 'education', 'geology', 'design', 'medicine',
    'robotics', 'astronomy', 'ecology', 'manufacturing', 'operations', 'marketing', 'legal', 'governance',
    'security', 'cryptography', 'analytics', 'journalism', 'ethics', 'planning', 'logistics', 'navigation',
  ],
  values: [
    'v1', 'v2', 'v3', 'q1', 'q2', 'q3', 'q4', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'kpi', 'sla', 'slo',
    'p50', 'p95', 'p99', 'cpu', 'io', 'api', 'sdk', 'ui', 'ux', 'sql', 'json',
  ],
};

const DEFAULT_SENTENCE_STARTS = [
  'This note tracks',
  'The current run evaluates',
  'Our team reviewed',
  'The plugin should maintain',
  'A follow-up analysis confirmed',
  'In this draft we compare',
];

const DEFAULT_SETTINGS = {
  outputDir: path.resolve(process.cwd(), 'demo-vault', 'load-testing'),
  filePrefix: 'load-test',
  paragraphMinWords: 80,
  paragraphMaxWords: 180,
  introMinWords: 6,
  introMaxWords: 14,
  closingMinWords: 6,
  closingMaxWords: 16,
  profiles: DEFAULT_PROFILES,
  wordBank: DEFAULT_WORD_BANK,
  sentenceStarts: DEFAULT_SENTENCE_STARTS,
};

function printHelp() {
  console.log('Usage: node generate-load-testing-vault.mjs [options]');
  console.log('');
  console.log('Options:');
  console.log('  --output-dir=PATH              Output directory (default: demo-vault/load-testing)');
  console.log('  (output directory is fully cleared on every run)');
  console.log('  --file-prefix=PREFIX           File prefix (default: load-test)');
  console.log('  --profile=label:count:min:max  Add a profile (repeatable). Replaces defaults when used.');
  console.log('  --small-count=N                Set count for the "small" profile');
  console.log('  --medium-count=N               Set count for the "medium" profile');
  console.log('  --large-count=N                Set count for the "large" profile');
  console.log('  --paragraph-min=N              Min words per generated paragraph block');
  console.log('  --paragraph-max=N              Max words per generated paragraph block');
  console.log('  --intro-min=N                  Min intro sentence words');
  console.log('  --intro-max=N                  Max intro sentence words');
  console.log('  --closing-min=N                Min closing sentence words');
  console.log('  --closing-max=N                Max closing sentence words');
  console.log('  --config=PATH                  JSON config file for full customization');
  console.log('  --help                         Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  node generate-load-testing-vault.mjs');
  console.log('  node generate-load-testing-vault.mjs --small-count=100 --medium-count=50 --large-count=25');
  console.log('  node generate-load-testing-vault.mjs --profile=tiny:200:20:60 --profile=huge:5:8000:12000');
  console.log('  node generate-load-testing-vault.mjs --output-dir=../demo-vault/load-testing');
}

function parseArgs(argv) {
  const options = {};

  for (const arg of argv) {
    if (arg === '--help') {
      options.help = true;
      continue;
    }

    if (!arg.startsWith('--')) {
      throw new Error(`Unknown argument: ${arg}`);
    }

    const eqIndex = arg.indexOf('=');
    const key = eqIndex === -1 ? arg.slice(2) : arg.slice(2, eqIndex);
    const rawValue = eqIndex === -1 ? 'true' : arg.slice(eqIndex + 1);

    if (key === 'profile') {
      if (!Array.isArray(options.profile)) {
        options.profile = [];
      }
      options.profile.push(rawValue);
      continue;
    }

    options[key] = rawValue;
  }

  return options;
}

function parsePositiveInteger(rawValue, fallback) {
  if (rawValue === undefined) {
    return fallback;
  }

  const value = Number.parseInt(String(rawValue), 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function normalizeWordBank(rawWordBank) {
  if (Array.isArray(rawWordBank) && rawWordBank.length > 0) {
    return {
      nouns: rawWordBank,
      verbs: [],
      adjectives: [],
      domains: [],
      values: [],
    };
  }

  if (rawWordBank && typeof rawWordBank === 'object') {
    const asRecord = rawWordBank;
    const toArray = (key) => Array.isArray(asRecord[key]) ? asRecord[key].map(String).filter(Boolean) : [];
    const normalized = {
      nouns: toArray('nouns'),
      verbs: toArray('verbs'),
      adjectives: toArray('adjectives'),
      domains: toArray('domains'),
      values: toArray('values'),
    };

    const allWords = [
      ...normalized.nouns,
      ...normalized.verbs,
      ...normalized.adjectives,
      ...normalized.domains,
      ...normalized.values,
    ];
    if (allWords.length > 0) {
      return normalized;
    }
  }

  return DEFAULT_WORD_BANK;
}

function parseProfile(rawProfile) {
  const parts = rawProfile.split(':').map((part) => part.trim()).filter(Boolean);
  if (parts.length !== 4) {
    throw new Error(`Invalid --profile format: "${rawProfile}". Expected label:count:min:max`);
  }

  const [label, countRaw, minWordsRaw, maxWordsRaw] = parts;
  const count = Number.parseInt(countRaw, 10);
  const minWords = Number.parseInt(minWordsRaw, 10);
  const maxWords = Number.parseInt(maxWordsRaw, 10);

  if (!label) {
    throw new Error(`Invalid profile label in "${rawProfile}".`);
  }
  if (!Number.isFinite(count) || count <= 0) {
    throw new Error(`Invalid profile count in "${rawProfile}".`);
  }
  if (!Number.isFinite(minWords) || minWords <= 0) {
    throw new Error(`Invalid profile min words in "${rawProfile}".`);
  }
  if (!Number.isFinite(maxWords) || maxWords < minWords) {
    throw new Error(`Invalid profile max words in "${rawProfile}".`);
  }

  return { label, count, minWords, maxWords };
}

function loadJsonConfig(configPath) {
  const absolutePath = path.isAbsolute(configPath) ? configPath : path.resolve(process.cwd(), configPath);
  const raw = readFileSync(absolutePath, 'utf8');
  return JSON.parse(raw);
}

function normalizeSettings(options) {
  const config = options.config ? loadJsonConfig(options.config) : {};
  const configProfiles = Array.isArray(config.profiles) ? config.profiles : DEFAULT_SETTINGS.profiles;
  const cliProfiles = Array.isArray(options.profile) ? options.profile.map(parseProfile) : undefined;

  const outputDirValue = options['output-dir'] ?? config.outputDir ?? DEFAULT_SETTINGS.outputDir;
  const outputDir = path.isAbsolute(outputDirValue) ? outputDirValue : path.resolve(process.cwd(), outputDirValue);

  const paragraphMinWords = parsePositiveInteger(
    options['paragraph-min'],
    parsePositiveInteger(config.paragraphMinWords, DEFAULT_SETTINGS.paragraphMinWords),
  );
  const paragraphMaxWords = parsePositiveInteger(
    options['paragraph-max'],
    parsePositiveInteger(config.paragraphMaxWords, DEFAULT_SETTINGS.paragraphMaxWords),
  );
  const introMinWords = parsePositiveInteger(
    options['intro-min'],
    parsePositiveInteger(config.introMinWords, DEFAULT_SETTINGS.introMinWords),
  );
  const introMaxWords = parsePositiveInteger(
    options['intro-max'],
    parsePositiveInteger(config.introMaxWords, DEFAULT_SETTINGS.introMaxWords),
  );
  const closingMinWords = parsePositiveInteger(
    options['closing-min'],
    parsePositiveInteger(config.closingMinWords, DEFAULT_SETTINGS.closingMinWords),
  );
  const closingMaxWords = parsePositiveInteger(
    options['closing-max'],
    parsePositiveInteger(config.closingMaxWords, DEFAULT_SETTINGS.closingMaxWords),
  );

  const countOverrides = {
    small: parsePositiveInteger(options['small-count'], parsePositiveInteger(config.smallCount, 0)),
    medium: parsePositiveInteger(options['medium-count'], parsePositiveInteger(config.mediumCount, 0)),
    large: parsePositiveInteger(options['large-count'], parsePositiveInteger(config.largeCount, 0)),
  };

  const profiles = (cliProfiles ?? configProfiles).map((profile) => {
    const label = String(profile.label);
    const overrideCount = countOverrides[label];
    if (!overrideCount) {
      return profile;
    }

    return {
      ...profile,
      count: overrideCount,
    };
  });
  const wordBank = normalizeWordBank(config.wordBank);
  const sentenceStarts = Array.isArray(config.sentenceStarts) && config.sentenceStarts.length > 0
    ? config.sentenceStarts
    : DEFAULT_SETTINGS.sentenceStarts;

  if (!Array.isArray(profiles) || profiles.length === 0) {
    throw new Error('At least one profile is required.');
  }
  if (paragraphMaxWords < paragraphMinWords) {
    throw new Error('paragraph-max must be >= paragraph-min.');
  }
  if (introMaxWords < introMinWords) {
    throw new Error('intro-max must be >= intro-min.');
  }
  if (closingMaxWords < closingMinWords) {
    throw new Error('closing-max must be >= closing-min.');
  }
  if (wordBank.length === 0) {
    throw new Error('wordBank cannot be empty.');
  }
  if (sentenceStarts.length === 0) {
    throw new Error('sentenceStarts cannot be empty.');
  }

  return {
    outputDir,
    filePrefix: String(options['file-prefix'] ?? config.filePrefix ?? DEFAULT_SETTINGS.filePrefix).trim() || DEFAULT_SETTINGS.filePrefix,
    paragraphMinWords,
    paragraphMaxWords,
    introMinWords,
    introMaxWords,
    closingMinWords,
    closingMaxWords,
    profiles,
    wordBank,
    sentenceStarts,
  };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(items) {
  return items[randomInt(0, items.length - 1)];
}

function pickWord(wordBank) {
  const sources = [
    ...wordBank.nouns,
    ...wordBank.verbs,
    ...wordBank.adjectives,
    ...wordBank.domains,
    ...wordBank.values,
  ];
  if (sources.length === 0) {
    return 'placeholder';
  }

  const compoundChance = Math.random();
  if (compoundChance < 0.12 && wordBank.adjectives.length > 0 && wordBank.nouns.length > 0) {
    return `${pickRandom(wordBank.adjectives)}-${pickRandom(wordBank.nouns)}`;
  }
  if (compoundChance >= 0.12 && compoundChance < 0.2 && wordBank.verbs.length > 0 && wordBank.domains.length > 0) {
    return `${pickRandom(wordBank.verbs)}-${pickRandom(wordBank.domains)}`;
  }
  if (compoundChance >= 0.2 && compoundChance < 0.26 && wordBank.values.length > 0 && wordBank.nouns.length > 0) {
    return `${pickRandom(wordBank.values)}-${pickRandom(wordBank.nouns)}`;
  }

  return pickRandom(sources);
}

function randomWordSequence(length, wordBank) {
  const words = [];
  for (let index = 0; index < length; index += 1) {
    words.push(pickWord(wordBank));
  }
  return words.join(' ');
}

function buildParagraph(targetWords, settings) {
  const intro = `${pickRandom(settings.sentenceStarts)} ${randomWordSequence(randomInt(settings.introMinWords, settings.introMaxWords), settings.wordBank)}.`;
  const body = `${randomWordSequence(Math.max(10, targetWords - 20), settings.wordBank)}.`;
  const closing = `${pickRandom(settings.sentenceStarts)} ${randomWordSequence(randomInt(settings.closingMinWords, settings.closingMaxWords), settings.wordBank)}.`;
  return [intro, body, closing].join(' ');
}

function buildNote(profile, noteNumber, targetWords, settings) {
  const title = `Load test ${profile.label} note ${String(noteNumber).padStart(3, '0')}`;
  const paragraphs = [];
  let remainingWords = targetWords;

  while (remainingWords > 0) {
    const blockSize = Math.min(remainingWords, randomInt(settings.paragraphMinWords, settings.paragraphMaxWords));
    paragraphs.push(buildParagraph(blockSize, settings));
    remainingWords -= blockSize;
  }

  return [
    '---',
    `tags: [load-testing, ${profile.label}]`,
    `size: ${profile.label}`,
    '---',
    '',
    `# ${title}`,
    '',
    ...paragraphs.map((paragraph) => `${paragraph}\n`),
  ].join('\n');
}

function ensureDirectory(directoryPath) {
  mkdirSync(directoryPath, { recursive: true });
}

function createNotes(settings) {
  rmSync(settings.outputDir, { recursive: true, force: true });
  ensureDirectory(settings.outputDir);

  let createdFiles = 0;

  for (const profile of settings.profiles) {
    const normalizedProfile = {
      label: String(profile.label),
      count: parsePositiveInteger(profile.count, 1),
      minWords: parsePositiveInteger(profile.minWords, 20),
      maxWords: parsePositiveInteger(profile.maxWords, 20),
    };
    if (normalizedProfile.maxWords < normalizedProfile.minWords) {
      throw new Error(`Profile "${normalizedProfile.label}" has maxWords < minWords.`);
    }

    const sizeDir = path.join(settings.outputDir, normalizedProfile.label);
    ensureDirectory(sizeDir);

    for (let noteNumber = 1; noteNumber <= normalizedProfile.count; noteNumber += 1) {
      const targetWords = randomInt(normalizedProfile.minWords, normalizedProfile.maxWords);
      const filename = `${settings.filePrefix}-${normalizedProfile.label}-${String(noteNumber).padStart(3, '0')}.md`;
      const fullPath = path.join(sizeDir, filename);
      const content = buildNote(normalizedProfile, noteNumber, targetWords, settings);
      writeFileSync(fullPath, content, 'utf8');
      createdFiles += 1;
    }
  }

  console.log(`Generated ${createdFiles} files in ${settings.outputDir}`);
  console.log(`Profiles: ${settings.profiles.map((profile) => profile.label).join(', ')}`);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const settings = normalizeSettings(options);
  createNotes(settings);
}

main();
