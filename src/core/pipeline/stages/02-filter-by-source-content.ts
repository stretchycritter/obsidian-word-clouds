import type { PipelineSelectionRules } from '@/core/pipeline/types';
import type { PipelineDocument } from '@/core';

type SearchCacheEntry = {
  pathLower: string;
  basenameLower: string;
  rawText: string;
  rawTextLower: string;
};

const SEARCH_CACHE = new WeakMap<PipelineDocument, SearchCacheEntry>();

export function selectDocuments(documents: PipelineDocument[], rules?: PipelineSelectionRules): PipelineDocument[] {
  if (!rules) {
    return documents;
  }
  const queryText = rules.queryText?.trim().toLowerCase() ?? '';
  if (queryText.length === 0) {
    return documents;
  }

  return documents.filter((document) => matchesQueryText(document, queryText));
}

function matchesQueryText(document: PipelineDocument, queryText: string): boolean {
  const cache = getOrCreateCache(document);
  if (cache.pathLower.includes(queryText) || cache.basenameLower.includes(queryText)) {
    return true;
  }

  if (cache.rawText !== document.rawText) {
    cache.rawText = document.rawText;
    cache.rawTextLower = document.rawText.toLowerCase();
  }

  return cache.rawTextLower.includes(queryText);
}

function getOrCreateCache(document: PipelineDocument): SearchCacheEntry {
  const existing = SEARCH_CACHE.get(document);
  if (existing) {
    return existing;
  }

  const created: SearchCacheEntry = {
    pathLower: document.path.toLowerCase(),
    basenameLower: document.basename.toLowerCase(),
    rawText: document.rawText,
    rawTextLower: document.rawText.toLowerCase(),
  };
  SEARCH_CACHE.set(document, created);
  return created;
}
