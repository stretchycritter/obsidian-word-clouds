import type { RenderSettings } from '@/settings/types';
import type { WeightedWord } from '@/core/types';
import type { AggregateResult, DistributionBucket, NormalizedDocument, RenderModel } from '@/core/pipeline/types';
import { mapCountsToWeightedWords } from '@/shared/word-scaling';

const MAX_WORDS = 140;
const MIN_WORD_LENGTH = 3;
const TOKEN_PATTERN = /[a-z0-9][a-z0-9'-]*/g;

export function aggregatePipelineDocuments(
  documents: NormalizedDocument[],
  stopWords: Set<string>,
): AggregateResult {
  const counts = new Map<string, number>();
  let totalTokens = 0;

  for (const document of documents) {
    const values = document.text.match(TOKEN_PATTERN) ?? [];
    for (const token of values) {
      const normalized = token.trim();
      if (normalized.length < MIN_WORD_LENGTH || stopWords.has(normalized)) {
        continue;
      }

      totalTokens += 1;
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }
  }

  const entries = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_WORDS);

  return {
    entries,
    totalTokens,
    distinctTokens: counts.size,
  };
}

export function scalePipelineEntries(
  entries: Array<[string, number]>,
  renderSettings: RenderSettings,
): WeightedWord[] {
  return mapCountsToWeightedWords(entries, renderSettings);
}

export function createPipelineRenderModel(words: WeightedWord[], aggregate: AggregateResult): RenderModel {
  return {
    wordCloudWords: words,
    distributionSeries: buildDistributionSeries(words),
    totalTokens: aggregate.totalTokens,
    distinctTokens: aggregate.distinctTokens,
  };
}

function buildDistributionSeries(words: WeightedWord[]): DistributionBucket[] {
  if (words.length === 0) {
    return [];
  }

  const maxCount = words[0]?.count ?? 0;
  if (maxCount <= 0) {
    return [];
  }

  const bucketCount = Math.min(8, Math.max(4, Math.round(Math.sqrt(words.length))));
  const width = Math.max(1, Math.ceil(maxCount / bucketCount));
  const buckets = new Map<number, number>();

  for (const word of words) {
    const index = Math.min(bucketCount - 1, Math.floor((word.count - 1) / width));
    buckets.set(index, (buckets.get(index) ?? 0) + 1);
  }

  const distribution: DistributionBucket[] = [];
  for (let index = 0; index < bucketCount; index += 1) {
    const min = index * width + 1;
    const max = index === bucketCount - 1 ? maxCount : (index + 1) * width;
    distribution.push({
      label: `${min}-${max}`,
      min,
      max,
      value: buckets.get(index) ?? 0,
    });
  }

  return distribution;
}
