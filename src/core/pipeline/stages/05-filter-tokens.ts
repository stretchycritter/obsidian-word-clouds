import type { Token } from '@/core/pipeline/types';

export function filterTokens(tokens: Token[], stopWords: Set<string>, minWordLength: number): Token[] {
  return tokens.filter((token) => token.value.length >= minWordLength && !stopWords.has(token.value));
}
