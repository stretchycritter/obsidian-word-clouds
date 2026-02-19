import type { Token } from '@/core/pipeline/types';

const MIN_WORD_LENGTH = 3;

export function filterTokens(tokens: Token[], stopWords: Set<string>): Token[] {
  return tokens.filter((token) => token.value.length >= MIN_WORD_LENGTH && !stopWords.has(token.value));
}
