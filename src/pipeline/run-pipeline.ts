import { DEFAULT_PIPELINE_STRATEGIES } from './strategies';
import { aggregateTokens } from './stages/aggregate';
import { filterTokens } from './stages/filter';
import { normalizeDocuments } from './stages/normalize';
import { createRenderModel } from './stages/render-model';
import { scaleEntries } from './stages/scale';
import { selectDocuments } from './stages/source-selection';
import { tokenizeDocuments } from './stages/tokenize';
import type { PipelineInput, PipelineStrategies, RenderModel } from './types';

export function runPipeline(
  input: PipelineInput,
  overrides: Partial<PipelineStrategies> = {},
): RenderModel {
  const strategies: PipelineStrategies = {
    ...DEFAULT_PIPELINE_STRATEGIES,
    ...overrides,
  };

  const selectedDocuments = selectDocuments(input.documents, input.sourceRules);
  const normalizedDocuments = normalizeDocuments(selectedDocuments);
  const tokens = tokenizeDocuments(normalizedDocuments, strategies.tokenizer);
  const filteredTokens = filterTokens(tokens, input.stopWords, strategies.filter);
  const aggregateResult = aggregateTokens(filteredTokens, strategies.aggregator);
  const words = scaleEntries(aggregateResult.entries, input.renderSettings, strategies.scaling);

  return createRenderModel(words, aggregateResult, strategies.renderModel);
}
