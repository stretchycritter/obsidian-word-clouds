import { applyFrequencyThresholds } from '@/core/pipeline/stages/07-apply-frequency-thresholds';
import { normalizeDocuments } from '@/core/pipeline/stages/03-normalize-documents';
import { selectDocuments } from '@/core/pipeline/stages/02-filter-by-source-content';
import { tokenizeDocuments } from '@/core/pipeline/stages/04-tokenize-documents';
import { processTokensNlp } from '@/core/pipeline/stages/04b-process-tokens-nlp';
import { filterTokens } from '@/core/pipeline/stages/05-filter-tokens';
import { aggregateTokens } from '@/core/pipeline/stages/06-aggregate-token-counts';
import { scaleEntries } from '@/core/pipeline/stages/08-scale-word-weights';
import { createRenderModel } from '@/core/pipeline/stages/09-create-render-model';
import type { PipelineInput, RenderModel } from '@/core/pipeline/types';

export function runTransformPipeline(input: PipelineInput): RenderModel {
  const selectedDocuments = selectDocuments(input.documents, input.sourceRules);
  const normalizedDocuments = normalizeDocuments(selectedDocuments);
  const tokens = tokenizeDocuments(normalizedDocuments);
  const nlpTokens = processTokensNlp(tokens, input.nlpSettings);
  const filteredTokens = filterTokens(nlpTokens, input.stopWords, input.minWordLength);
  const aggregateResult = aggregateTokens(filteredTokens);
  const filteredEntries = applyFrequencyThresholds(aggregateResult.entries, input.frequency);
  const words = scaleEntries(filteredEntries, input.renderSettings);

  return createRenderModel(words, aggregateResult);
}
