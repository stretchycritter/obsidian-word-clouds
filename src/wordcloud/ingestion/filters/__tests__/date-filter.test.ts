import type { SourceSelectionRules } from '../../../../settings/types';
import type { TFile } from 'obsidian';
import { compileDatePredicate } from '../date-filter';

describe('compileDatePredicate', () => {
  it('returns null when no date constraints exist', () => {
    const predicate = compileDatePredicate({});
    expect(predicate).toBeNull();
  });

  it('matches modified and created ranges', () => {
    const predicate = compileDatePredicate({
      modifiedTime: {
        after: 100,
        before: 200,
      },
      createdTime: {
        between: {
          start: 10,
          end: 20,
        },
      },
    });

    expect(predicate).not.toBeNull();
    expect(predicate?.(createFile('A.md', 150, 15))).toBe(true);
    expect(predicate?.(createFile('B.md', 210, 15))).toBe(false);
    expect(predicate?.(createFile('C.md', 150, 30))).toBe(false);
  });

  it('normalizes swapped between bounds', () => {
    const rules: SourceSelectionRules = {
      modifiedTime: {
        between: {
          start: 500,
          end: 300,
        },
      },
    };

    const predicate = compileDatePredicate(rules);
    expect(predicate).not.toBeNull();
    expect(predicate?.(createFile('A.md', 400, 0))).toBe(true);
    expect(predicate?.(createFile('B.md', 250, 0))).toBe(false);
  });
});

function createFile(path: string, mtime: number, ctime: number): TFile {
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
      mtime,
      ctime,
      size: 0,
    },
  } as TFile;
}
