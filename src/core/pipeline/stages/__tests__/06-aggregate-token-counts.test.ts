import { aggregateTokens } from '@/core/pipeline/stages/06-aggregate-token-counts';
import type { Token } from '@/core/pipeline/types';

function buildToken(value: string): Token {
  return {
    rawValue: value,
    value,
    documentId: 'doc-1',
  };
}

describe('aggregateTokens', () => {
  it('counts total and distinct tokens and sorts by descending count', () => {
    const result = aggregateTokens([
      buildToken('alpha'),
      buildToken('beta'),
      buildToken('alpha'),
      buildToken('gamma'),
      buildToken('beta'),
      buildToken('alpha'),
    ]);

    expect(result.totalTokens).toBe(6);
    expect(result.distinctTokens).toBe(3);
    expect(result.entries).toEqual([
      ['alpha', 3],
      ['beta', 2],
      ['gamma', 1],
    ]);
  });

  it('caps output entries to the maximum supported size', () => {
    const tokens: Token[] = [];
    for (let index = 1; index <= 150; index += 1) {
      tokens.push(buildToken(`word-${String(index).padStart(3, '0')}`));
    }

    const result = aggregateTokens(tokens);

    expect(result.totalTokens).toBe(150);
    expect(result.distinctTokens).toBe(150);
    expect(result.entries).toHaveLength(140);
    expect(result.entries[0]?.[0]).toBe('word-001');
    expect(result.entries[result.entries.length - 1]?.[0]).toBe('word-140');
  });
});
