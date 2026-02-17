import { DEFAULT_PIPELINE_STRATEGIES } from './strategies';
import { aggregateTokens } from './stages/06-aggregate-token-counts';
import { applyFrequencyThresholds } from './stages/07-apply-frequency-thresholds';
import { filterTokens } from './stages/05-filter-tokens';
import { normalizeDocuments } from './stages/03-normalize-documents';
import { createRenderModel } from './stages/09-create-render-model';
import { scaleEntries } from './stages/08-scale-word-weights';
import { selectDocuments } from './stages/02-filter-by-source-content';
import { tokenizeDocuments } from './stages/04-tokenize-documents';
import type { PipelineInput, PipelineStrategies, RenderModel } from './types';

export function runTransformPipeline(
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
  const filteredEntries = applyFrequencyThresholds(aggregateResult.entries, input.frequency);
  const words = scaleEntries(filteredEntries, input.renderSettings, strategies.scaling);

  return createRenderModel(words, aggregateResult, strategies.renderModel);
}
