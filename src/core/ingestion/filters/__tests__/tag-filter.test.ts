import type { App, CachedMetadata, TFile } from 'obsidian';
import type { SourceSelectionRules } from '@/settings/types';
import { compileTagPredicate } from '@/core/ingestion/filters/tag-filter';

describe('compileTagPredicate', () => {
  it('returns null when no include or exclude tags are configured', () => {
    const app = createMockApp({});
    const predicate = compileTagPredicate(app, {});
    expect(predicate).toBeNull();
  });

  it('matches include tags in any mode by default', () => {
    const file = createFile('Projects/Alpha.md');
    const app = createMockApp({
      'Projects/Alpha.md': ['#project', '#alpha'],
    });
    const rules: SourceSelectionRules = {
      includeTags: ['alpha', 'missing'],
    };

    const predicate = compileTagPredicate(app, rules);
    expect(predicate).not.toBeNull();
    expect(predicate?.(file)).toBe(true);
  });

  it('requires all include tags when tagMatchMode is all', () => {
    const file = createFile('Projects/Alpha.md');
    const app = createMockApp({
      'Projects/Alpha.md': ['#project'],
    });
    const rules: SourceSelectionRules = {
      includeTags: ['project', 'alpha'],
      tagMatchMode: 'all',
    };

    const predicate = compileTagPredicate(app, rules);
    expect(predicate).not.toBeNull();
    expect(predicate?.(file)).toBe(false);
  });

  it('supports include and exclude tag prefixes', () => {
    const file = createFile('Projects/Alpha.md');
    const app = createMockApp({
      'Projects/Alpha.md': ['#project/alpha', '#status/done'],
    });
    const rules: SourceSelectionRules = {
      includeTagPrefixes: ['project/'],
      excludeTagPrefixes: ['status/'],
    };

    const predicate = compileTagPredicate(app, rules);
    expect(predicate).not.toBeNull();
    expect(predicate?.(file)).toBe(false);
  });

  it('rejects files that contain excluded tags', () => {
    const file = createFile('Projects/Alpha.md');
    const app = createMockApp({
      'Projects/Alpha.md': ['#project', '#alpha'],
    });
    const rules: SourceSelectionRules = {
      includeTags: ['project'],
      excludeTags: ['alpha'],
    };

    const predicate = compileTagPredicate(app, rules);
    expect(predicate).not.toBeNull();
    expect(predicate?.(file)).toBe(false);
  });

  it('matches tags defined only in frontmatter', () => {
    const file = createFile('Projects/Alpha.md');
    const app = createMockApp(
      {},
      {
        'Projects/Alpha.md': {
          tags: ['project/alpha', 'status/open'],
        },
      },
    );
    const rules: SourceSelectionRules = {
      includeTagPrefixes: ['project/'],
      excludeTags: ['status/closed'],
    };

    const predicate = compileTagPredicate(app, rules);
    expect(predicate).not.toBeNull();
    expect(predicate?.(file)).toBe(true);
  });

  it('reuses cached file tags across repeated predicate checks', () => {
    const file = createFile('Projects/Alpha.md');
    let cacheReadCount = 0;
    const app = createMockApp(
      {
        'Projects/Alpha.md': ['#project', '#alpha'],
      },
      {},
      () => {
        cacheReadCount += 1;
      },
    );
    const rules: SourceSelectionRules = {
      includeTags: ['project'],
    };

    const predicate = compileTagPredicate(app, rules);
    expect(predicate).not.toBeNull();
    expect(predicate?.(file)).toBe(true);
    expect(predicate?.(file)).toBe(true);
    expect(cacheReadCount).toBe(1);
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

function createMockApp(
  tagsByPath: Record<string, string[]>,
  frontmatterByPath: Record<string, Record<string, unknown>> = {},
  onGetFileCache?: () => void,
): App {
  return {
    metadataCache: {
      getFileCache(file: TFile): CachedMetadata | null {
        onGetFileCache?.();
        const tags = tagsByPath[file.path];
        const frontmatter = frontmatterByPath[file.path];
        if (!tags && !frontmatter) {
          return null;
        }

        return {
          tags: tags?.map((tag) => ({ tag })),
          frontmatter,
        } as unknown as CachedMetadata;
      },
    },
  } as unknown as App;
}
