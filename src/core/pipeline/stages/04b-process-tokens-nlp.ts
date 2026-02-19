import type { Token } from '@/core/pipeline/types';
import type { NlpMode, NlpSettings } from '@/settings/types';

export function processTokensNlp(tokens: Token[], settings: NlpSettings): Token[] {
  if (!settings.enabled || settings.mode === 'off') {
    return tokens;
  }

  const transformed: Token[] = [];
  for (const token of tokens) {
    const nextToken = transformToken(token, settings);
    if (!nextToken || !nextToken.value) {
      continue;
    }
    transformed.push(nextToken);
  }

  return transformed;
}

function transformToken(token: Token, settings: NlpSettings): Token | null {
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

  const candidates = mode === 'aggressive'
    ? [
      value.replace(/ies$/i, 'y'),
      value.replace(/ing$/i, ''),
      value.replace(/ed$/i, ''),
      value.replace(/tion$/i, ''),
      value.replace(/ions$/i, 'ion'),
      value.replace(/ment$/i, ''),
      value.replace(/ly$/i, ''),
      value.replace(/es$/i, ''),
      value.replace(/s$/i, ''),
    ]
    : [
      value.replace(/ies$/i, 'y'),
      value.replace(/ing$/i, ''),
      value.replace(/ed$/i, ''),
      value.replace(/es$/i, ''),
      value.replace(/s$/i, ''),
    ];

  for (const candidate of candidates) {
    if (candidate === value) {
      continue;
    }
    if (candidate.length < minLemmaLength) {
      continue;
    }
    if (!/^[a-z0-9][a-z0-9'-]*$/i.test(candidate)) {
      continue;
    }
    return candidate;
  }

  return value;
}
