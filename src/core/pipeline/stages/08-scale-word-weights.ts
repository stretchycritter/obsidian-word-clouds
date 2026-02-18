import type { RenderSettings } from '@/settings/types';
import type { WeightedWord } from '@/core/types';
import type { ScalingStrategy } from '@/core/pipeline/types';

export function scaleEntries(
  entries: Array<[string, number]>,
  renderSettings: RenderSettings,
  strategy: ScalingStrategy,
): WeightedWord[] {
  return strategy.scale(entries, renderSettings);
}
