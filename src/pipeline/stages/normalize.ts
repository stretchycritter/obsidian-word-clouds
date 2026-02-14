import { FRONTMATTER_PATTERN } from '../../constants';
import type { NormalizedDocument, PipelineDocument } from '../types';

export function normalizeDocuments(documents: PipelineDocument[]): NormalizedDocument[] {
  return documents.map((document) => ({
    id: document.id,
    path: document.path,
    basename: document.basename,
    tags: [...document.tags],
    text: document.rawText
      .replace(FRONTMATTER_PATTERN, '')
      .toLowerCase()
      .normalize('NFKC'),
  }));
}
