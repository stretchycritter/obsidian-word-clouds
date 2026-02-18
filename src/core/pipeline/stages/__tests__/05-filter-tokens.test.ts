import { filterTokens } from '@/core/pipeline/stages/05-filter-tokens';
import type { FilterStrategy, Token } from '@/core/pipeline/types';

describe('filterTokens', () => {
  it('filters tokens using strategy.includeToken and provided stop words', () => {
    const tokens: Token[] = [
      { value: 'alpha', documentId: '1' },
      { value: 'the', documentId: '1' },
      { value: 'beta', documentId: '2' },
    ];
    const stopWords = new Set(['the']);

    const strategy: FilterStrategy = {
      includeToken(token: string, words: Set<string>): boolean {
        return !words.has(token);
      },
    };

    const result = filterTokens(tokens, stopWords, strategy);
    expect(result).toEqual([
      { value: 'alpha', documentId: '1' },
      { value: 'beta', documentId: '2' },
    ]);
  });
});
