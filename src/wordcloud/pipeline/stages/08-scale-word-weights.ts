import type { RenderSettings } from '../../../settings/types';
import type { WeightedWord } from '../../types';
import type { ScalingStrategy } from '../types';

export function scaleEntries(
  entries: Array<[string, number]>,
  renderSettings: RenderSettings,
  strategy: ScalingStrategy,
): WeightedWord[] {
  return strategy.scale(entries, renderSettings);
}
