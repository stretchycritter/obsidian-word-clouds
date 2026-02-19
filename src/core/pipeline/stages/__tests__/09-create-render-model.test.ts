import { createRenderModel } from '@/core/pipeline/stages/09-create-render-model';
import type { WeightedWord } from '@/core';

describe('createRenderModel', () => {
  it('creates model metadata and distribution buckets', () => {
    const words: WeightedWord[] = [
      { text: 'alpha', count: 8, size: 40 },
      { text: 'beta', count: 4, size: 24 },
      { text: 'gamma', count: 4, size: 24 },
      { text: 'delta', count: 1, size: 14 },
    ];

    const result = createRenderModel(words, {
      entries: words.map((word) => [word.text, word.count]),
      totalTokens: 17,
      distinctTokens: 4,
    });

    expect(result.wordCloudWords).toBe(words);
    expect(result.totalTokens).toBe(17);
    expect(result.distinctTokens).toBe(4);
    expect(result.distributionSeries).toEqual([
      { label: '1-2', min: 1, max: 2, value: 1 },
      { label: '3-4', min: 3, max: 4, value: 2 },
      { label: '5-6', min: 5, max: 6, value: 0 },
      { label: '7-8', min: 7, max: 8, value: 1 },
    ]);
  });

  it('returns an empty distribution for empty input words', () => {
    const result = createRenderModel([], {
      entries: [],
      totalTokens: 0,
      distinctTokens: 0,
    });

    expect(result.distributionSeries).toEqual([]);
  });
});
