import type { NormalizedDocument, Token, TokenizerStrategy } from '../types';

export function tokenizeDocuments(documents: NormalizedDocument[], strategy: TokenizerStrategy): Token[] {
  const tokens: Token[] = [];

  for (const document of documents) {
    const values = strategy.tokenize(document.text);
    for (const value of values) {
      tokens.push({
        value,
        documentId: document.id,
      });
    }
  }

  return tokens;
}
