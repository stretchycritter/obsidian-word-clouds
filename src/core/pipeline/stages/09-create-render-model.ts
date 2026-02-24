import type { WeightedWord } from '@/core';
import type { AggregateResult, DistributionBucket, RenderModel } from '@/core/pipeline/types';

export function createRenderModel(words: WeightedWord[], aggregateResult: AggregateResult): RenderModel {
  return {
    wordCloudWords: words,
    distributionSeries: buildDistributionSeries(words),
    totalTokens: aggregateResult.totalTokens,
    distinctTokens: aggregateResult.distinctTokens,
  };
}

function buildDistributionSeries(words: WeightedWord[]): DistributionBucket[] {
  if (words.length === 0) {
    return [];
  }

  const maxCount = words.length > 0 ? Math.max(...words.map((w) => w.count)) : 0;
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
