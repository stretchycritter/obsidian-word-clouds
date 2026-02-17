import type { AggregateResult, AggregatorStrategy, Token } from '../types';

export function aggregateTokens(tokens: Token[], strategy: AggregatorStrategy): AggregateResult {
  return strategy.aggregate(tokens);
}
