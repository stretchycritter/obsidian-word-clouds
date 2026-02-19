import type { WeightedWord } from '@/core';
import type { RenderSettings } from '@/settings/types';
import { mapCountsToWeightedWords } from '@/shared/word-scaling';

export function scaleEntries(
  entries: Array<[string, number]>,
  renderSettings: RenderSettings,
): WeightedWord[] {
  return mapCountsToWeightedWords(entries, renderSettings);
}
