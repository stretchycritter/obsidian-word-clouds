import { applyFrequencyThresholds } from '@/core/pipeline/stages/07-apply-frequency-thresholds';
import { normalizeDocuments } from '@/core/pipeline/stages/03-normalize-documents';
import { selectDocuments } from '@/core/pipeline/stages/02-filter-by-source-content';
import type { PipelineInput, RenderModel } from '@/core/pipeline/types';
import {
  aggregatePipelineDocuments,
  createPipelineRenderModel,
  scalePipelineEntries,
} from '@/core/pipeline/implementation';

export function runTransformPipeline(input: PipelineInput): RenderModel {
  const selectedDocuments = selectDocuments(input.documents, input.sourceRules);
  const normalizedDocuments = normalizeDocuments(selectedDocuments);
  const aggregateResult = aggregatePipelineDocuments(normalizedDocuments, input.stopWords);
  const filteredEntries = applyFrequencyThresholds(aggregateResult.entries, input.frequency);
  const words = scalePipelineEntries(filteredEntries, input.renderSettings);

  return createPipelineRenderModel(words, aggregateResult);
}
