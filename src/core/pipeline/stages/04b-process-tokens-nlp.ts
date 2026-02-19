import type { Token } from '@/core/pipeline/types';
import type { NlpMode, NlpSettings } from '@/settings/types';

export function processTokensNlp(tokens: Token[], settings: NlpSettings): Token[] {
  if (!settings.enabled || settings.mode === 'off') {
    return tokens;
  }

  const transformed: Token[] = [];
  for (const token of tokens) {
    const nextToken = processTokenNlp(token, settings);
    if (!nextToken || !nextToken.value) {
      continue;
    }
    transformed.push(nextToken);
  }

  return transformed;
}

const CANDIDATE_PATTERN = /^[a-z0-9][a-z0-9'-]*$/i;

type LemmaRule = readonly [suffix: string, replacement: string];

const LIGHT_RULES: readonly LemmaRule[] = [
  ['ies', 'y'],
  ['ing', ''],
  ['ed', ''],
  ['es', ''],
  ['s', ''],
];

const AGGRESSIVE_RULES: readonly LemmaRule[] = [
  ['ies', 'y'],
  ['ing', ''],
  ['ed', ''],
  ['tion', ''],
  ['ions', 'ion'],
  ['ment', ''],
  ['ly', ''],
  ['es', ''],
  ['s', ''],
];

export function processTokenNlp(token: Token, settings: NlpSettings): Token | null {
  if (!settings.enabled || settings.mode === 'off') {
    return token;
  }

  if (settings.filterNumericTokens && token.flags?.isNumeric) {
    return null;
  }

  if (settings.preserveAcronyms && token.flags?.isAcronym) {
    return token;
  }

  const cleaned = normalizeToken(token.value, settings.mode);
  if (!cleaned) {
    return null;
  }

  const lemma = maybeLemmatize(cleaned, settings.mode, settings.minLemmaLength);
  return {
    ...token,
    value: lemma,
    flags: {
      ...token.flags,
      normalizedByNlp: lemma !== token.value,
    },
  };
}

function normalizeToken(value: string, mode: NlpMode): string {
  let next = value.trim();
  if (!next) {
    return '';
  }

  next = next
    .replace(/^'+|'+$/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/'s$/i, '');

  if (mode === 'aggressive') {
    next = next.replace(/['-]+/g, '');
  }

  return next;
}

function maybeLemmatize(value: string, mode: NlpMode, minLemmaLength: number): string {
  if (value.length < minLemmaLength) {
    return value;
  }

  const rules = mode === 'aggressive' ? AGGRESSIVE_RULES : LIGHT_RULES;
  for (const [suffix, replacement] of rules) {
    if (!value.endsWith(suffix)) {
      continue;
    }
    const candidate = `${value.slice(0, -suffix.length)}${replacement}`;
    if (candidate.length < minLemmaLength || candidate === value || !CANDIDATE_PATTERN.test(candidate)) {
      continue;
    }

    return candidate;
  }

  return value;
}
