import type { RenderSettings } from '../../settings/types';
import type { WeightedWord } from '../types';

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

  const normalizedEntries = entries
    .map(([text, count], index) => ({
      text,
      count,
      index,
      score: computeScaleScore(count, index, entries, renderSettings, emphasis),
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
  entries: Array<[string, number]>,
  renderSettings: RenderSettings,
  emphasis: number,
): number {
  const counts = entries.map(([, entryCount]) => entryCount);
  const minCount = counts[counts.length - 1];
  const maxCount = counts[0];

  if (maxCount <= minCount) {
    return 0.5;
  }

  if (renderSettings.scalingMode === 'rank') {
    if (entries.length === 1) {
      return 0.5;
    }
    return 1 - index / (entries.length - 1);
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
