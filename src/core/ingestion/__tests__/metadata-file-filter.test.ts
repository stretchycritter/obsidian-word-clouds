import { type App, type CachedMetadata, type TAbstractFile, TFile } from 'obsidian';
import { filterSourceFilesByMetadata } from '@/core/ingestion/metadata-file-filter';

describe('filterSourceFilesByMetadata', () => {
  it('returns the input files when no rules are provided', () => {
    const files = [createFile('Projects/Alpha.md'), createFile('Projects/Beta.md')];
    const app = {} as App;
    expect(filterSourceFilesByMetadata(app, files)).toEqual(files);
  });

  it('filters by path rules', () => {
    const files = [
      createFile('Projects/Alpha.md'),
      createFile('Projects/Sub/Beta.md'),
      createFile('Journal/Daily.md'),
    ];
    const app = createMockApp({}, {}, {});

    const result = filterSourceFilesByMetadata(app, files, {
      pathRules: {
        folderPrefixes: ['Projects/'],
        filenameRegex: '^Al',
        extensions: ['md'],
      },
    });

    expect(result.map((file) => file.path)).toEqual(['Projects/Alpha.md']);
  });

  it('filters by active file scope', () => {
    const files = [
      createFile('Projects/Alpha.md'),
      createFile('Projects/Beta.md'),
      createFile('Journal/Daily.md'),
    ];
    const app = createMockApp({}, {}, {});

    const result = filterSourceFilesByMetadata(app, files, {
      scope: {
        mode: 'active-file',
        activeFilePath: 'Projects/Beta.md',
      },
    });

    expect(result.map((file) => file.path)).toEqual(['Projects/Beta.md']);
  });

  it('filters by folder scope', () => {
    const files = [
      createFile('Projects/Alpha.md'),
      createFile('Projects/Sub/Beta.md'),
      createFile('Journal/Daily.md'),
    ];
    const app = createMockApp({}, {}, {});

    const result = filterSourceFilesByMetadata(app, files, {
      scope: {
        mode: 'folder',
        folderPaths: ['Projects'],
      },
    });

    expect(result.map((file) => file.path)).toEqual(['Projects/Alpha.md', 'Projects/Sub/Beta.md']);
  });

  it('filters by include and exclude tags including tag prefixes', () => {
    const files = [
      createFile('Projects/Alpha.md'),
      createFile('Projects/Beta.md'),
      createFile('Journal/Daily.md'),
    ];
    const app = createMockApp(
      {
        'Projects/Alpha.md': ['#project/alpha', '#status/open'],
        'Projects/Beta.md': ['#project/beta', '#status/closed'],
        'Journal/Daily.md': ['#journal'],
      },
      {},
      {},
    );

    const result = filterSourceFilesByMetadata(app, files, {
      includeTagPrefixes: ['project/'],
      excludeTags: ['status/closed'],
    });

    expect(result.map((file) => file.path)).toEqual(['Projects/Alpha.md']);
  });

  it('filters by frontmatter key/value and date/stat ranges', () => {
    const files = [
      createFile('Projects/Alpha.md', 1500, 900),
      createFile('Projects/Beta.md', 2200, 900),
      createFile('Journal/Daily.md', 1500, 500),
    ];

    const app = createMockApp(
      {},
      {
        'Projects/Alpha.md': { status: 'published', rating: 5, publishedAt: '2025-01-02' },
        'Projects/Beta.md': { status: 'draft', rating: 1, publishedAt: '2024-12-20' },
        'Journal/Daily.md': { status: 'published', rating: 5, publishedAt: '2025-01-02' },
      },
      {},
    );

    const result = filterSourceFilesByMetadata(app, files, {
      frontmatterRules: [
        { key: 'status', operator: 'equals', value: 'published' },
        { key: 'rating', operator: 'gte', value: '3' },
        { key: 'publishedAt', operator: 'gt', value: '2025-01-01' },
      ],
      modifiedTime: {
        before: 2000,
      },
      createdTime: {
        after: 700,
      },
    });

    expect(result.map((file) => file.path)).toEqual(['Projects/Alpha.md']);
  });

  it('filters by outgoing and incoming links with composition rules', () => {
    const files = [
      createFile('Projects/Alpha.md'),
      createFile('Projects/Beta.md'),
      createFile('Journal/Daily.md'),
    ];

    const app = createMockApp(
      {
        'Projects/Alpha.md': ['#project'],
        'Projects/Beta.md': ['#beta'],
        'Journal/Daily.md': ['#journal'],
      },
      {},
      {
        'Projects/Alpha.md': {
          'Journal/Daily.md': 1,
          'Projects/Beta.md': 1,
        },
        'Projects/Beta.md': {
          'Journal/Daily.md': 1,
        },
      },
    );

    const result = filterSourceFilesByMetadata(app, files, {
      outgoingLinks: {
        folderPrefixes: ['Journal'],
        withTags: ['journal'],
        minCount: 1,
      },
      incomingLinks: {
        filePaths: ['Projects/Alpha.md'],
      },
    });

    expect(result.map((file) => file.path)).toEqual(['Projects/Beta.md']);
  });

  it('builds the link index once when both outgoing and incoming link rules are enabled', () => {
    const files = [
      createFile('Projects/Alpha.md'),
      createFile('Projects/Beta.md'),
      createFile('Journal/Daily.md'),
    ];
    let resolvedLinksReadCount = 0;
    const app = createMockApp(
      {
        'Projects/Alpha.md': ['#project'],
        'Projects/Beta.md': ['#beta'],
        'Journal/Daily.md': ['#journal'],
      },
      {},
      {
        'Projects/Alpha.md': {
          'Journal/Daily.md': 1,
          'Projects/Beta.md': 1,
        },
        'Projects/Beta.md': {
          'Journal/Daily.md': 1,
        },
      },
      () => {
        resolvedLinksReadCount += 1;
      },
    );

    filterSourceFilesByMetadata(app, files, {
      outgoingLinks: {
        minCount: 1,
      },
      incomingLinks: {
        minCount: 1,
      },
    });

    expect(resolvedLinksReadCount).toBe(1);
  });
});

function createFile(path: string, mtime = 0, ctime = 0): TFile {
  const name = path.split('/').at(-1) ?? path;
  const dotIndex = name.lastIndexOf('.');
  const basename = dotIndex >= 0 ? name.slice(0, dotIndex) : name;
  const extension = dotIndex >= 0 ? name.slice(dotIndex + 1) : '';
  return Object.assign(new TFile(), {
    path,
    name,
    basename,
    extension,
    stat: { mtime, ctime, size: 0 },
  });
}

function createMockApp(
  tagsByPath: Record<string, string[]>,
  frontmatterByPath: Record<string, Record<string, unknown>>,
  resolvedLinks: Record<string, Record<string, number>>,
  onResolvedLinksRead?: () => void,
): App {
  const metadataCache = {
    get resolvedLinks(): Record<string, Record<string, number>> {
      onResolvedLinksRead?.();
      return resolvedLinks;
    },
    getFileCache(file: TFile): CachedMetadata | null {
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
  };

  return {
    metadataCache,
    vault: {
      getAbstractFileByPath(path: string): TAbstractFile | null {
        if (!tagsByPath[path] && !frontmatterByPath[path]) {
          return null;
        }

        return createFile(path) as unknown as TAbstractFile;
      },
    },
  } as unknown as App;
}
