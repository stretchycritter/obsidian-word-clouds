import { tokenizeDocuments } from '@/core/pipeline/stages/04-tokenize-documents';

describe('tokenizeDocuments', () => {
  it('extracts lowercase token values and preserves source document id', () => {
    const tokens = tokenizeDocuments([
      {
        id: 'doc-1',
        path: 'Notes/One.md',
        basename: 'One',
        tags: [],
        text: "API v2 is 2024-ready and don't-stop",
      },
    ]);

    expect(tokens.map((token) => [token.value, token.documentId])).toEqual([
      ['api', 'doc-1'],
      ['v2', 'doc-1'],
      ['is', 'doc-1'],
      ['2024-ready', 'doc-1'],
      ['and', 'doc-1'],
      ["don't-stop", 'doc-1'],
    ]);
  });

  it('marks acronym and numeric flags from raw token values', () => {
    const tokens = tokenizeDocuments([
      {
        id: 'doc-1',
        path: 'Notes/Flags.md',
        basename: 'Flags',
        tags: [],
        text: 'NASA 42 test',
      },
    ]);

    expect(tokens.map((token) => token.flags)).toEqual([
      { isAcronym: true, isNumeric: false },
      { isAcronym: false, isNumeric: true },
      { isAcronym: false, isNumeric: false },
    ]);
  });
});
