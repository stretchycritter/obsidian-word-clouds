import type { NormalizedDocument, Token } from '@/core/pipeline/types';

const TOKEN_PATTERN = /[a-z0-9][a-z0-9'-]*/gi;
const ACRONYM_PATTERN = /^[A-Z]{2,}$/;
const NUMERIC_PATTERN = /^\d+$/;

export function tokenizeDocuments(documents: NormalizedDocument[]): Token[] {
  return Array.from(iterateDocumentTokens(documents));
}

export function* iterateDocumentTokens(documents: NormalizedDocument[]): IterableIterator<Token> {
  for (const document of documents) {
    const values = document.text.match(TOKEN_PATTERN) ?? [];
    for (const rawValue of values) {
      yield {
        rawValue,
        value: rawValue.toLowerCase(),
        documentId: document.id,
        flags: {
          isAcronym: ACRONYM_PATTERN.test(rawValue),
          isNumeric: NUMERIC_PATTERN.test(rawValue),
        },
      };
    }
  }
}
