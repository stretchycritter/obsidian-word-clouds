import type { PipelineDocument } from '@/core';
import type { NormalizedDocument } from '@/core/pipeline/types';

const FRONTMATTER_PATTERN = /^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/;
const WORD_CLOUD_BLOCK_PATTERN = /```(?:wordcloud|word-cloud)\s*\n[\s\S]*?\n```/gi;

export function normalizeDocuments(documents: PipelineDocument[]): NormalizedDocument[] {
  return documents.map((document) => ({
    id: document.id,
    path: document.path,
    basename: document.basename,
    tags: [...document.tags],
    text: document.rawText
      .replace(FRONTMATTER_PATTERN, '')
      .replace(WORD_CLOUD_BLOCK_PATTERN, '')
      .toLowerCase()
      .normalize('NFKC'),
  }));
}
