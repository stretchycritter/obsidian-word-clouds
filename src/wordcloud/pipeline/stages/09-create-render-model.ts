import type { AggregateResult, RenderModel, RenderModelStrategy } from '../types';
import type { WeightedWord } from '../../../wordcloud/types';

export function createRenderModel(
  words: WeightedWord[],
  aggregateResult: AggregateResult,
  strategy: RenderModelStrategy,
): RenderModel {
  return strategy.buildModel(words, aggregateResult);
}
