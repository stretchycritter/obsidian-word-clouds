import type { PipelineSelectionRules } from '@/core/pipeline/types';
import type { PipelineDocument } from '@/core';

export function selectDocuments(documents: PipelineDocument[], rules?: PipelineSelectionRules): PipelineDocument[] {
  if (!rules) {
    return documents;
  }
  const queryText = rules.queryText?.trim().toLowerCase() ?? '';
  if (queryText.length === 0) {
    return documents;
  }

  return documents.filter((document) => matchesQueryText(document, queryText));
}

function matchesQueryText(document: PipelineDocument, queryText: string): boolean {
  return document.path.toLowerCase().includes(queryText)
    || document.basename.toLowerCase().includes(queryText)
    || document.rawText.toLowerCase().includes(queryText);
}
