import { selectDocuments } from '@/core/pipeline/stages/02-filter-by-source-content';
import type { PipelineDocument } from '@/core';

const DOCS: PipelineDocument[] = [
  {
    id: '1',
    path: 'Projects/Alpha.md',
    basename: 'Alpha',
    rawText: 'Alpha body with roadmap',
    tags: ['#project', '#alpha'],
    frontmatter: { status: 'published', rating: 5, featured: true, tags: ['alpha'] },
  },
  {
    id: '2',
    path: 'Projects/Beta.md',
    basename: 'Beta',
    rawText: 'Beta draft notes',
    tags: ['#project', '#beta'],
    frontmatter: { status: 'draft', rating: 2, featured: false },
  },
  {
    id: '3',
    path: 'Archive/Old.md',
    basename: 'Old',
    rawText: 'Legacy archive content',
    tags: ['#archive'],
    frontmatter: {},
  },
];

describe('selectDocuments', () => {
  it('returns original documents when no rules are provided', () => {
    const result = selectDocuments(DOCS);
    expect(result).toBe(DOCS);
  });

  it('returns original documents when rules have no query text', () => {
    const result = selectDocuments(DOCS, {
      scope: { mode: 'active-file', activeFilePath: 'Projects/Beta.md' },
      includeTags: ['#project'],
      excludeTags: ['#beta'],
      frontmatterRules: [{ key: 'status', operator: 'equals', value: 'published' }],
    });
    expect(result).toBe(DOCS);
  });

  it('filters with queryText against path, basename, and raw text', () => {
    expect(selectDocuments(DOCS, { queryText: 'archive' }).map((doc) => doc.id)).toEqual(['3']);
    expect(selectDocuments(DOCS, { queryText: 'alpha' }).map((doc) => doc.id)).toEqual(['1']);
    expect(selectDocuments(DOCS, { queryText: 'draft notes' }).map((doc) => doc.id)).toEqual(['2']);
  });
});
