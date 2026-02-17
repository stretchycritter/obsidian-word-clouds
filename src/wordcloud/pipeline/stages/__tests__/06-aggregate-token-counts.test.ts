import { aggregateTokens } from '../06-aggregate-token-counts';
import type { AggregateResult, AggregatorStrategy, Token } from '../../types';

describe('aggregateTokens', () => {
  it('delegates aggregation to the configured strategy', () => {
    const tokens: Token[] = [
      { value: 'alpha', documentId: '1' },
      { value: 'beta', documentId: '1' },
    ];

    const expected: AggregateResult = {
      entries: [['alpha', 1], ['beta', 1]],
      totalTokens: 2,
      distinctTokens: 2,
    };

    const strategy: AggregatorStrategy = {
      aggregate(input: Token[]): AggregateResult {
        expect(input).toBe(tokens);
        return expected;
      },
    };

    expect(aggregateTokens(tokens, strategy)).toBe(expected);
  });
});
