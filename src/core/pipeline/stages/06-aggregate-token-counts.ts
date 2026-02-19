import type { AggregateResult, Token } from '@/core/pipeline/types';

const MAX_WORDS = 140;

export function aggregateTokens(tokens: Token[]): AggregateResult {
  const counts = new Map<string, number>();

  for (const token of tokens) {
    counts.set(token.value, (counts.get(token.value) ?? 0) + 1);
  }

  const entries = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_WORDS);

  return {
    entries,
    totalTokens: tokens.length,
    distinctTokens: counts.size,
  };
}
