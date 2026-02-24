import type { Token } from '@/core/pipeline/types';

/**
 * NOTE: This module is NOT called by the production pipeline (run-transform-pipeline.ts).
 * Filtering is inlined directly in run-transform-pipeline.ts for performance.
 * This module exists as a documented, testable reference for the filtering logic.
 * If you modify filtering behaviour, update BOTH this module AND run-transform-pipeline.ts.
 */

export function filterTokens(tokens: Token[], stopWords: Set<string>, minWordLength: number): Token[] {
  return tokens.filter((token) => token.value.length >= minWordLength && !stopWords.has(token.value));
}
