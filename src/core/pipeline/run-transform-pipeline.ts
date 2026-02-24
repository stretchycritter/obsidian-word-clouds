import { applyFrequencyThresholds } from '@/core/pipeline/stages/07-apply-frequency-thresholds';
import { normalizeDocuments } from '@/core/pipeline/stages/03-normalize-documents';
import { selectDocuments } from '@/core/pipeline/stages/02-filter-by-source-content';
import { iterateDocumentTokens } from '@/core/pipeline/stages/04-tokenize-documents';
import { processTokenNlp } from '@/core/pipeline/stages/04b-process-tokens-nlp';
import { selectTopEntries } from '@/core/pipeline/stages/06-aggregate-token-counts';
import { scaleEntries } from '@/core/pipeline/stages/08-scale-word-weights';
import { createRenderModel } from '@/core/pipeline/stages/09-create-render-model';
import type { PipelineInput, RenderModel } from '@/core/pipeline/types';

export function runTransformPipeline(input: PipelineInput): RenderModel {
  const selectedDocuments = selectDocuments(input.documents, input.sourceRules);
  const normalizedDocuments = normalizeDocuments(selectedDocuments);
  // NOTE: This inlines the aggregation logic from stages/06-aggregate-token-counts.ts#aggregateTokens()
  // for performance (avoids an intermediate Map copy). Any changes to filtering or aggregation
  // semantics must be reflected both here and in stage 06, which remains the testable reference
  // implementation.
  const counts = new Map<string, { count: number; firstSeen: number }>();
  let totalTokens = 0;
  let firstSeen = 0;

  for (const token of iterateDocumentTokens(normalizedDocuments)) {
    const nextToken = processTokenNlp(token, input.nlpSettings);
    if (!nextToken || nextToken.value.length < input.minWordLength || input.stopWords.has(nextToken.value)) {
      continue;
    }

    totalTokens += 1;
    const existing = counts.get(nextToken.value);
    if (existing) {
      existing.count += 1;
      continue;
    }

    counts.set(nextToken.value, {
      count: 1,
      firstSeen,
    });
    firstSeen += 1;
  }

  const entries = selectTopEntries(counts);
  const filteredEntries = applyFrequencyThresholds(entries, input.frequency);
  const words = scaleEntries(filteredEntries, input.renderSettings);

  return createRenderModel(words, {
    entries,
    totalTokens,
    distinctTokens: counts.size,
  });
}
