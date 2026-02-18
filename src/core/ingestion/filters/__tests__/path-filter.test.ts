import type { SourceSelectionRules } from '@/settings/types';
import type { TFile } from 'obsidian';
import { compilePathPredicate } from '@/core/ingestion/filters/path-filter';

describe('compilePathPredicate', () => {
  it('returns null when no path rules are provided', () => {
    const predicate = compilePathPredicate({});
    expect(predicate).toBeNull();
  });

  it('returns null when path rules have no constraints', () => {
    const rules: SourceSelectionRules = {
      pathRules: {
        folderPrefixes: ['  '],
        exactFolders: [],
      },
    };
    const predicate = compilePathPredicate(rules);
    expect(predicate).toBeNull();
  });

  it('matches files that satisfy all configured constraints', () => {
    const rules: SourceSelectionRules = {
      pathRules: {
        folderPrefixes: ['Projects/'],
        exactFolders: ['Projects/Sub'],
        subfolderRoots: ['Projects'],
        filenameEquals: ['alpha', 'beta.md'],
        filenameRegex: '^alp',
        extensions: ['.md'],
      },
    };
    const predicate = compilePathPredicate(rules);

    expect(predicate).not.toBeNull();
    expect(predicate?.(createFile('Projects/Sub/Alpha.md'))).toBe(true);
    expect(predicate?.(createFile('Projects/Alpha.md'))).toBe(false);
    expect(predicate?.(createFile('Projects/Sub/Beta.md'))).toBe(false);
    expect(predicate?.(createFile('Journal/Sub/Alpha.md'))).toBe(false);
  });

  it('ignores invalid regex and keeps other constraints active', () => {
    const rules: SourceSelectionRules = {
      pathRules: {
        folderPrefixes: ['Projects/'],
        filenameRegex: '[',
      },
    };
    const predicate = compilePathPredicate(rules);

    expect(predicate).not.toBeNull();
    expect(predicate?.(createFile('Projects/Alpha.md'))).toBe(true);
    expect(predicate?.(createFile('Journal/Alpha.md'))).toBe(false);
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
