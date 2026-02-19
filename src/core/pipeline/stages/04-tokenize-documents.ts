import type { NormalizedDocument, Token } from '@/core/pipeline/types';

const TOKEN_PATTERN = /[a-z0-9][a-z0-9'-]*/g;

export function tokenizeDocuments(documents: NormalizedDocument[]): Token[] {
  const tokens: Token[] = [];

  for (const document of documents) {
    const values = document.text.match(TOKEN_PATTERN) ?? [];
    for (const value of values) {
      tokens.push({
        value,
        documentId: document.id,
      });
    }
  }

  return tokens;
}
