import { scaleEntries } from '../08-scale-word-weights';
import type { ScalingStrategy } from '../../types';
import type { RenderSettings, WeightedWord } from '../../../../types';

describe('scaleEntries', () => {
  it('delegates scaling to the configured strategy', () => {
    const entries: Array<[string, number]> = [['alpha', 3]];
    const renderSettings = { maxWords: 50 } as unknown as RenderSettings;
    const expected: WeightedWord[] = [{ text: 'alpha', count: 3, size: 12 }];

    const strategy: ScalingStrategy = {
      scale(inputEntries: Array<[string, number]>, inputSettings: RenderSettings): WeightedWord[] {
        expect(inputEntries).toBe(entries);
        expect(inputSettings).toBe(renderSettings);
        return expected;
      },
    };

    expect(scaleEntries(entries, renderSettings, strategy)).toBe(expected);
  });
});
