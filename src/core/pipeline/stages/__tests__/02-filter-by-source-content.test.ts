import { selectDocuments } from '@/core/pipeline/stages/02-filter-by-source-content';
import type { PipelineDocument } from '@/core/types';

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

  it('filters by active-file scope', () => {
    const result = selectDocuments(DOCS, {
      scope: { mode: 'active-file', activeFilePath: 'Projects/Beta.md' },
    });
    expect(result.map((doc) => doc.id)).toEqual(['2']);
  });

  it('filters by folder scope', () => {
    const result = selectDocuments(DOCS, {
      scope: { mode: 'folder', folderPaths: ['Projects'] },
    });
    expect(result.map((doc) => doc.id)).toEqual(['1', '2']);
  });

  it('matches include tags in any mode', () => {
    const result = selectDocuments(DOCS, {
      includeTags: ['project', '#archive'],
      tagMatchMode: 'any',
    });
    expect(result.map((doc) => doc.id)).toEqual(['1', '2', '3']);
  });

  it('matches include tags in all mode', () => {
    const result = selectDocuments(DOCS, {
      includeTags: ['#project', '#alpha'],
      tagMatchMode: 'all',
    });
    expect(result.map((doc) => doc.id)).toEqual(['1']);
  });

  it('applies exclude tags after include tags', () => {
    const result = selectDocuments(DOCS, {
      includeTags: ['#project'],
      excludeTags: ['#beta'],
      tagMatchMode: 'any',
    });
    expect(result.map((doc) => doc.id)).toEqual(['1']);
  });

  it('filters with queryText against path, basename, and raw text', () => {
    expect(selectDocuments(DOCS, { queryText: 'archive' }).map((doc) => doc.id)).toEqual(['3']);
    expect(selectDocuments(DOCS, { queryText: 'alpha' }).map((doc) => doc.id)).toEqual(['1']);
    expect(selectDocuments(DOCS, { queryText: 'draft notes' }).map((doc) => doc.id)).toEqual(['2']);
  });

  it('applies frontmatter exists and not-exists', () => {
    const existsResult = selectDocuments(DOCS, {
      frontmatterRules: [{ key: 'status', operator: 'exists' }],
    });
    expect(existsResult.map((doc) => doc.id)).toEqual(['1', '2']);

    const notExistsResult = selectDocuments(DOCS, {
      frontmatterRules: [{ key: 'status', operator: 'not-exists' }],
    });
    expect(notExistsResult.map((doc) => doc.id)).toEqual(['3']);
  });

  it('applies frontmatter numeric comparisons', () => {
    const gteResult = selectDocuments(DOCS, {
      frontmatterRules: [{ key: 'rating', operator: 'gte', value: '3' }],
    });
    expect(gteResult.map((doc) => doc.id)).toEqual(['1']);

    const ltResult = selectDocuments(DOCS, {
      frontmatterRules: [{ key: 'rating', operator: 'lt', value: '3' }],
    });
    expect(ltResult.map((doc) => doc.id)).toEqual(['2']);
  });

  it('applies frontmatter equality/inequality with booleans', () => {
    const equalsResult = selectDocuments(DOCS, {
      frontmatterRules: [{ key: 'featured', operator: 'equals', value: 'true' }],
    });
    expect(equalsResult.map((doc) => doc.id)).toEqual(['1']);

    const notEqualsResult = selectDocuments(DOCS, {
      frontmatterRules: [{ key: 'featured', operator: 'not-equals', value: 'true' }],
    });
    expect(notEqualsResult.map((doc) => doc.id)).toEqual(['2']);
  });

  it('applies frontmatter contains for arrays and strings', () => {
    const arrayContains = selectDocuments(DOCS, {
      frontmatterRules: [{ key: 'tags', operator: 'contains', value: 'alp' }],
    });
    expect(arrayContains.map((doc) => doc.id)).toEqual(['1']);

    const stringContains = selectDocuments(DOCS, {
      frontmatterRules: [{ key: 'status', operator: 'contains', value: 'pub' }],
    });
    expect(stringContains.map((doc) => doc.id)).toEqual(['1']);
  });

  it('applies frontmatter date comparisons', () => {
    const docsWithDates: PipelineDocument[] = [
      {
        ...DOCS[0],
        frontmatter: { publishedAt: '2025-01-03' },
      },
      {
        ...DOCS[1],
        frontmatter: { publishedAt: '2024-12-28' },
      },
    ];

    const result = selectDocuments(docsWithDates, {
      frontmatterRules: [{ key: 'publishedAt', operator: 'gt', value: '2025-01-01' }],
    });

    expect(result.map((doc) => doc.id)).toEqual(['1']);
  });
});
