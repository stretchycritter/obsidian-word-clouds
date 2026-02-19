import type { WeightedWord } from '@/core';
import type { RenderSettings } from '@/settings/types';

export function mapCountsToWeightedWords(
  entries: Array<[string, number]>,
  renderSettings: RenderSettings,
): WeightedWord[] {
  if (entries.length === 0) {
    return [];
  }

  const minFontSize = Math.max(8, Math.round(renderSettings.minFontSize));
  const maxFontSize = Math.max(minFontSize, Math.round(renderSettings.maxFontSize));
  const emphasis = Math.max(0.5, Math.min(3, renderSettings.emphasis));
  const minCount = entries[entries.length - 1]?.[1] ?? 0;
  const maxCount = entries[0]?.[1] ?? 0;

  const normalizedEntries = entries
    .map(([text, count], index) => ({
      text,
      count,
      index,
      score: computeScaleScore(count, index, entries.length, minCount, maxCount, renderSettings, emphasis),
    }))
    .sort((a, b) => b.count - a.count || a.index - b.index);

  return normalizedEntries.map((entry) => ({
    text: entry.text,
    count: entry.count,
    size: Math.round(minFontSize + entry.score * (maxFontSize - minFontSize)),
  }));
}

function computeScaleScore(
  count: number,
  index: number,
  entryCount: number,
  minCount: number,
  maxCount: number,
  renderSettings: RenderSettings,
  emphasis: number,
): number {
  if (maxCount <= minCount) {
    return 0.5;
  }

  if (renderSettings.scalingMode === 'rank') {
    if (entryCount === 1) {
      return 0.5;
    }
    return 1 - index / (entryCount - 1);
  }

  if (renderSettings.scalingMode === 'log') {
    const safeMin = Math.max(1, minCount);
    const safeMax = Math.max(safeMin + 1, maxCount);
    const numerator = Math.log(Math.max(1, count)) - Math.log(safeMin);
    const denominator = Math.log(safeMax) - Math.log(safeMin);
    return clamp01(denominator === 0 ? 0.5 : numerator / denominator);
  }

  const linear = (count - minCount) / (maxCount - minCount);
  if (renderSettings.scalingMode === 'power') {
    return clamp01(Math.pow(linear, emphasis));
  }

  return clamp01(linear);
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
