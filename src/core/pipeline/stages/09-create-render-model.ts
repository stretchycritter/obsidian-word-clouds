import type { AggregateResult, RenderModel, RenderModelStrategy } from '@/core/pipeline/types';
import type { WeightedWord } from '@/domain/word-cloud';

export function createRenderModel(
  words: WeightedWord[],
  aggregateResult: AggregateResult,
  strategy: RenderModelStrategy,
): RenderModel {
  return strategy.buildModel(words, aggregateResult);
}
