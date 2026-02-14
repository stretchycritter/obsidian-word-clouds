import type { FilterStrategy, Token } from '../types';

export function filterTokens(tokens: Token[], stopWords: Set<string>, strategy: FilterStrategy): Token[] {
  return tokens.filter((token) => strategy.includeToken(token.value, stopWords));
}
