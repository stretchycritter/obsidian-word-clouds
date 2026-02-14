import { MAX_WORDS, MIN_WORD_LENGTH } from '../../constants';
import type { RenderSettings, WeightedWord } from '../../types';
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
} from '../types';

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
    if (entries.length === 0) {
      return [];
    }

    const minFontSize = Math.max(8, Math.round(renderSettings.minFontSize));
    const maxFontSize = Math.max(minFontSize + 1, Math.round(renderSettings.maxFontSize));
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
