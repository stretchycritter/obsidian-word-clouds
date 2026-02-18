import type { FrequencyThresholds } from '@/settings/types';

export function applyFrequencyThresholds(
  entries: Array<[string, number]>,
  thresholds?: FrequencyThresholds,
): Array<[string, number]> {
  if (!thresholds) {
    return entries;
  }

  const minCount = clampThreshold(thresholds.minCount, 1);
  const maxCount = clampThreshold(thresholds.maxCount, Number.MAX_SAFE_INTEGER);
  const safeMinCount = Math.min(minCount, maxCount);

  return entries.filter(([, count]) => count >= safeMinCount && count <= maxCount);
}

function clampThreshold(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }

  return Math.max(1, Math.round(value));
}
