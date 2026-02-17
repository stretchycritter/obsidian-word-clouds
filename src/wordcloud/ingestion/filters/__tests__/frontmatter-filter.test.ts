import type { App, CachedMetadata, TFile } from 'obsidian';
import type { SourceSelectionRules } from '../../../pipeline/types';
import { compileFrontmatterPredicate } from '../frontmatter-filter';

describe('compileFrontmatterPredicate', () => {
  it('returns null when no frontmatter rules are configured', () => {
    const app = createMockApp({});
    const predicate = compileFrontmatterPredicate(app, {});
    expect(predicate).toBeNull();
  });

  it('matches key existence, scalar values, booleans, arrays, dates, and null-like checks', () => {
    const file = createFile('Projects/Alpha.md');
    const app = createMockApp({
      'Projects/Alpha.md': {
        status: 'published',
        featured: true,
        rating: 4,
        tags: ['alpha', 'project'],
        publishedAt: '2025-01-02',
        summary: null,
      },
    });

    const rules: SourceSelectionRules = {
      frontmatterRules: [
        { key: 'status', operator: 'equals', value: 'published' },
        { key: 'featured', operator: 'equals', value: 'true' },
        { key: 'rating', operator: 'gte', value: '3' },
        { key: 'tags', operator: 'contains', value: 'alp' },
        { key: 'publishedAt', operator: 'gt', value: '2025-01-01' },
        { key: 'summary', operator: 'equals', value: 'null' },
        { key: 'status', operator: 'exists' },
      ],
    };

    const predicate = compileFrontmatterPredicate(app, rules);
    expect(predicate).not.toBeNull();
    expect(predicate?.(file)).toBe(true);
  });

  it('supports missing/null logic via not-exists and not-equals', () => {
    const file = createFile('Projects/Beta.md');
    const app = createMockApp({
      'Projects/Beta.md': {
        status: 'draft',
      },
    });

    const rules: SourceSelectionRules = {
      frontmatterRules: [
        { key: 'summary', operator: 'not-exists' },
        { key: 'status', operator: 'not-equals', value: 'published' },
      ],
    };

    const predicate = compileFrontmatterPredicate(app, rules);
    expect(predicate).not.toBeNull();
    expect(predicate?.(file)).toBe(true);
  });
});

function createFile(path: string): TFile {
  const name = path.split('/').at(-1) ?? path;
  const dotIndex = name.lastIndexOf('.');
  const basename = dotIndex >= 0 ? name.slice(0, dotIndex) : name;
  const extension = dotIndex >= 0 ? name.slice(dotIndex + 1) : '';
  return {
    path,
    name,
    basename,
    extension,
    stat: {
      mtime: 0,
      ctime: 0,
      size: 0,
    },
  } as TFile;
}

function createMockApp(frontmatterByPath: Record<string, Record<string, unknown>>): App {
  return {
    metadataCache: {
      getFileCache(file: TFile): CachedMetadata | null {
        const frontmatter = frontmatterByPath[file.path];
        if (!frontmatter) {
          return null;
        }

        return { frontmatter } as unknown as CachedMetadata;
      },
    },
  } as unknown as App;
}
