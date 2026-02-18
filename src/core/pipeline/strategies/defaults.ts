import type { RenderSettings } from '@/settings/types';
import type { WeightedWord } from '@/core/types';
import { mapCountsToWeightedWords } from '@/core/pipeline/word-scaling';
import type {
  AggregateResult,
  AggregatorStrategy,
  DistributionBucket,
  FilterStrategy,
  PipelineStrategies,
  RenderModel,
  RenderModelStrategy,
  ScalingStrategy,
  Token,
  TokenizerStrategy,
} from '@/core/pipeline/types';

const MAX_WORDS = 140;
const MIN_WORD_LENGTH = 3;

const defaultTokenizer: TokenizerStrategy = {
  tokenize(text: string): string[] {
    return text.match(/[a-z0-9][a-z0-9'-]*/g) ?? [];
  },
};

const defaultFilter: FilterStrategy = {
  includeToken(token: string, stopWords: Set<string>): boolean {
    const normalized = token.trim();
    return normalized.length >= MIN_WORD_LENGTH && !stopWords.has(normalized);
  },
};

const defaultAggregator: AggregatorStrategy = {
  aggregate(tokens: Token[]): AggregateResult {
    const counts = new Map<string, number>();

    for (const token of tokens) {
      counts.set(token.value, (counts.get(token.value) ?? 0) + 1);
    }

    const entries = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_WORDS);

    return {
      entries,
      totalTokens: tokens.length,
      distinctTokens: counts.size,
    };
  },
};

const defaultScaling: ScalingStrategy = {
  scale(entries: Array<[string, number]>, renderSettings: RenderSettings): WeightedWord[] {
    return mapCountsToWeightedWords(entries, renderSettings);
  },
};

const defaultRenderModel: RenderModelStrategy = {
  buildModel(words: WeightedWord[], aggregate: AggregateResult): RenderModel {
    return {
      wordCloudWords: words,
      distributionSeries: buildDistributionSeries(words),
      totalTokens: aggregate.totalTokens,
      distinctTokens: aggregate.distinctTokens,
    };
  },
};

export const DEFAULT_PIPELINE_STRATEGIES: PipelineStrategies = {
  tokenizer: defaultTokenizer,
  filter: defaultFilter,
  aggregator: defaultAggregator,
  scaling: defaultScaling,
  renderModel: defaultRenderModel,
};

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
