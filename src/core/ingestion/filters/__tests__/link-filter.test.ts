import type { App, CachedMetadata, TAbstractFile, TFile } from 'obsidian';
import type { SourceSelectionRules } from '@/settings/types';
import { compileIncomingLinkPredicate, compileOutgoingLinkPredicate } from '@/core/ingestion/filters/link-filter';

describe('link predicates', () => {
  it('matches outgoing links by file, folder, count threshold, and linked file tags', () => {
    const app = createMockApp(
      {
        'Projects/Alpha.md': ['#project', '#alpha'],
        'Projects/Beta.md': ['#project'],
        'Journal/Daily.md': ['#journal'],
      },
      {
        'Projects/Alpha.md': {
          'Projects/Beta.md': 2,
          'Journal/Daily.md': 1,
        },
      },
    );

    const rules: SourceSelectionRules = {
      outgoingLinks: {
        filePaths: ['Projects/Beta.md'],
        folderPrefixes: ['Projects'],
        minCount: 3,
        withTags: ['#project'],
        tagMatchMode: 'any',
      },
    };

    const predicate = compileOutgoingLinkPredicate(app, rules);
    expect(predicate).not.toBeNull();
    expect(predicate?.(createFile('Projects/Alpha.md'))).toBe(true);
    expect(predicate?.(createFile('Journal/Daily.md'))).toBe(false);
  });

  it('matches incoming links by source folder, count threshold, and source tag filters', () => {
    const app = createMockApp(
      {
        'Projects/Alpha.md': ['#project'],
        'Projects/Beta.md': ['#beta'],
        'Journal/Daily.md': ['#journal'],
      },
      {
        'Projects/Alpha.md': {
          'Journal/Daily.md': 1,
        },
        'Projects/Beta.md': {
          'Journal/Daily.md': 2,
        },
      },
    );

    const rules: SourceSelectionRules = {
      incomingLinks: {
        folderPrefixes: ['Projects'],
        minCount: 3,
        withTags: ['#beta'],
      },
    };

    const predicate = compileIncomingLinkPredicate(app, rules);
    expect(predicate).not.toBeNull();
    expect(predicate?.(createFile('Journal/Daily.md'))).toBe(true);
    expect(predicate?.(createFile('Projects/Alpha.md'))).toBe(false);
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
  resolvedLinks: Record<string, Record<string, number>>,
): App {
  return {
    metadataCache: {
      resolvedLinks,
      getFileCache(file: TFile): CachedMetadata | null {
        const tags = tagsByPath[file.path];
        if (!tags) {
          return null;
        }

        return {
          tags: tags.map((tag) => ({ tag })),
        } as unknown as CachedMetadata;
      },
    },
    vault: {
      getAbstractFileByPath(path: string): TAbstractFile | null {
        if (!tagsByPath[path]) {
          return null;
        }

        return createFile(path) as unknown as TAbstractFile;
      },
    },
  } as unknown as App;
}
