import { applyFrequencyThresholds } from '@/core/pipeline/stages/07-apply-frequency-thresholds';

describe('applyFrequencyThresholds', () => {
  it('returns original entries when thresholds are not provided', () => {
    const entries: Array<[string, number]> = [['alpha', 1], ['beta', 2]];
    expect(applyFrequencyThresholds(entries)).toBe(entries);
  });

  it('filters by min and max counts with clamped values', () => {
    const entries: Array<[string, number]> = [
      ['one', 1],
      ['two', 2],
      ['three', 3],
      ['four', 4],
    ];

    const result = applyFrequencyThresholds(entries, {
      minCount: 2.4,
      maxCount: 3.2,
    });

    expect(result).toEqual([
      ['two', 2],
      ['three', 3],
    ]);
  });

  it('handles min greater than max by using the max as effective minimum', () => {
    const entries: Array<[string, number]> = [['two', 2], ['three', 3], ['four', 4]];
    const result = applyFrequencyThresholds(entries, { minCount: 5, maxCount: 3 });
    expect(result).toEqual([['three', 3]]);
  });
});
