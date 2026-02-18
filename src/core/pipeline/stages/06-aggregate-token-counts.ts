import type { AggregateResult, AggregatorStrategy, Token } from '@/core/pipeline/types';

export function aggregateTokens(tokens: Token[], strategy: AggregatorStrategy): AggregateResult {
  return strategy.aggregate(tokens);
}
