import { tokenizeDocuments } from '../04-tokenize-documents';
import type { NormalizedDocument, TokenizerStrategy } from '../../types';

describe('tokenizeDocuments', () => {
  it('tokenizes each document and preserves documentId on emitted tokens', () => {
    const documents: NormalizedDocument[] = [
      { id: 'a', path: 'A.md', basename: 'A', text: 'one two', tags: [] },
      { id: 'b', path: 'B.md', basename: 'B', text: 'three', tags: [] },
    ];

    const strategy: TokenizerStrategy = {
      tokenize(text: string): string[] {
        return text.split(/\s+/).filter(Boolean);
      },
    };

    const result = tokenizeDocuments(documents, strategy);
    expect(result).toEqual([
      { value: 'one', documentId: 'a' },
      { value: 'two', documentId: 'a' },
      { value: 'three', documentId: 'b' },
    ]);
  });
});
