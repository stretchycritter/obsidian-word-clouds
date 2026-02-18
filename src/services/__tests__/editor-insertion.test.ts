const noticeMock = jest.fn();

jest.mock(
  'obsidian',
  () => ({
    MarkdownView: class {},
    Notice: class {
      constructor(message: string) {
        noticeMock(message);
      }
    },
  }),
  { virtual: true },
);

import type { App } from 'obsidian';
import { insertEmbedAtCursor } from '@/services/editor-insertion';

describe('insertEmbedAtCursor', () => {
  beforeEach(() => {
    noticeMock.mockReset();
  });

  test('returns false and shows a notice when no markdown view is active', () => {
    const app = {
      workspace: {
        getActiveViewOfType: jest.fn().mockReturnValue(null),
      },
    } as unknown as App;

    const inserted = insertEmbedAtCursor(app, '```wordcloud```');

    expect(inserted).toBe(false);
    expect(noticeMock).toHaveBeenCalledWith('Open a markdown note to insert a word cloud embed.');
  });

  test('inserts embed block with surrounding newlines when cursor is mid-line', () => {
    const replaceSelection = jest.fn();
    const view = {
      editor: {
        getCursor: jest.fn().mockReturnValue({ line: 0, ch: 6 }),
        getLine: jest.fn().mockReturnValue('before after'),
        replaceSelection,
      },
    };
    const app = {
      workspace: {
        getActiveViewOfType: jest.fn().mockReturnValue(view),
      },
    } as unknown as App;

    const inserted = insertEmbedAtCursor(app, '```wordcloud```');

    expect(inserted).toBe(true);
    expect(replaceSelection).toHaveBeenCalledWith('\n```wordcloud```\n');
  });
});
