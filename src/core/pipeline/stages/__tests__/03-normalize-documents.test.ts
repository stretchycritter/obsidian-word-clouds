import { normalizeDocuments } from '@/core/pipeline/stages/03-normalize-documents';

describe('normalizeDocuments', () => {
  it('returns an empty list for empty input', () => {
    expect(normalizeDocuments([])).toEqual([]);
  });

  it('removes leading frontmatter and applies NFKC normalization', () => {
    const [normalized] = normalizeDocuments([{
      id: 'note-1',
      path: 'Notes/Example.md',
      basename: 'Example',
      rawText: `---
title: Demo
---
Hello ＡＢＣ`,
      tags: ['#demo'],
      frontmatter: { title: 'Demo' },
    }]);

    expect(normalized?.text).toBe('Hello ABC');
  });

  it('preserves id, path, basename, and clones tags', () => {
    const sourceTags = ['#one', '#two'];
    const [normalized] = normalizeDocuments([
      {
        id: 'doc-id',
        path: 'Folder/Doc.md',
        basename: 'Doc',
        rawText: 'Body text',
        tags: sourceTags,
        frontmatter: {},
      },
    ]);

    expect(normalized).toMatchObject({
      id: 'doc-id',
      path: 'Folder/Doc.md',
      basename: 'Doc',
      text: 'Body text',
      tags: ['#one', '#two'],
    });
    expect(normalized?.tags).not.toBe(sourceTags);
  });

  it('does not remove yaml-like blocks that are not at the beginning of the document', () => {
    const [normalized] = normalizeDocuments([
      {
        id: 'note-2',
        path: 'Notes/Nested.md',
        basename: 'Nested',
        rawText: 'Intro\n---\ntitle: Not frontmatter\n---\nTail',
        tags: [],
        frontmatter: {},
      },
    ]);

    expect(normalized?.text).toBe('Intro\n---\ntitle: Not frontmatter\n---\nTail');
  });

  it('removes all embedded wordcloud code blocks', () => {
    const [normalized] = normalizeDocuments([
      {
        id: 'note-3',
        path: 'Notes/Clouds.md',
        basename: 'Clouds',
        rawText: [
          'Before',
          '```wordcloud',
          'scope: vault',
          '```',
          'Middle',
          '```word-cloud',
          'scope: file',
          '```',
          'After',
        ].join('\n'),
        tags: [],
        frontmatter: {},
      },
    ]);

    expect(normalized?.text).toBe('Before\n\nMiddle\n\nAfter');
  });
});
