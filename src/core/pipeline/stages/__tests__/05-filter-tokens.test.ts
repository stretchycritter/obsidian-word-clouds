import { filterTokens } from '@/core/pipeline/stages/05-filter-tokens';
import type { Token } from '@/core/pipeline/types';

describe('filterTokens', () => {
  it('removes stop words and tokens shorter than the configured minimum length', () => {
    const tokens: Token[] = [
      { rawValue: 'alpha', value: 'alpha', documentId: '1' },
      { rawValue: 'the', value: 'the', documentId: '1' },
      { rawValue: 'an', value: 'an', documentId: '1' },
      { rawValue: 'beta', value: 'beta', documentId: '2' },
    ];

    const result = filterTokens(tokens, new Set(['the']), 3);

    expect(result.map((token) => token.value)).toEqual(['alpha', 'beta']);
  });
});
