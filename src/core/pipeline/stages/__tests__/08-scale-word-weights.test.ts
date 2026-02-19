import { scaleEntries } from '@/core/pipeline/stages/08-scale-word-weights';
import { DEFAULT_SETTINGS } from '@/settings/constants';

describe('scaleEntries', () => {
  it('returns an empty array when no entries are provided', () => {
    expect(scaleEntries([], DEFAULT_SETTINGS.render)).toEqual([]);
  });

  it('maps counts to weighted words within configured font size bounds', () => {
    const renderSettings = {
      ...DEFAULT_SETTINGS.render,
      minFontSize: 10,
      maxFontSize: 30,
      scalingMode: 'linear' as const,
    };

    const words = scaleEntries([
      ['alpha', 10],
      ['beta', 5],
      ['gamma', 1],
    ], renderSettings);

    expect(words.map((word) => word.text)).toEqual(['alpha', 'beta', 'gamma']);
    expect(words[0]?.size).toBe(30);
    expect(words[2]?.size).toBe(10);
    expect(words.every((word) => word.size >= 10 && word.size <= 30)).toBe(true);
  });
});
