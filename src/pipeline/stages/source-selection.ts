import type { PipelineDocument, SourceSelectionRules } from '../types';
import { normalizeTag } from '../../utils';

export function selectDocuments(documents: PipelineDocument[], rules?: SourceSelectionRules): PipelineDocument[] {
  if (!rules) {
    return documents;
  }

  const normalizedTagFilters = (rules.tagFilters ?? [])
    .map((tag) => normalizeTag(tag))
    .filter((tag) => tag.length > 0);

  const includePrefixes = (rules.includePathPrefixes ?? []).map((prefix) => prefix.trim()).filter(Boolean);
  const excludePrefixes = (rules.excludePathPrefixes ?? []).map((prefix) => prefix.trim()).filter(Boolean);
  const queryText = rules.queryText?.trim().toLowerCase() ?? '';
  const tagMatchMode = rules.tagMatchMode ?? 'any';

  return documents.filter((document) => {
    if (!matchesPathRules(document.path, includePrefixes, excludePrefixes)) {
      return false;
    }

    if (normalizedTagFilters.length > 0 && !matchesTagRules(document.tags, normalizedTagFilters, tagMatchMode)) {
      return false;
    }

    if (queryText.length > 0 && !matchesQueryText(document, queryText)) {
      return false;
    }

    return true;
  });
}

function matchesPathRules(path: string, includePrefixes: string[], excludePrefixes: string[]): boolean {
  if (includePrefixes.length > 0 && !includePrefixes.some((prefix) => path.startsWith(prefix))) {
    return false;
  }

  if (excludePrefixes.some((prefix) => path.startsWith(prefix))) {
    return false;
  }

  return true;
}

function matchesTagRules(documentTags: string[], filters: string[], mode: 'any' | 'all'): boolean {
  const normalizedTags = new Set(documentTags.map((tag) => normalizeTag(tag)).filter(Boolean));
  if (mode === 'all') {
    return filters.every((filterTag) => normalizedTags.has(filterTag));
  }

  return filters.some((filterTag) => normalizedTags.has(filterTag));
}

function matchesQueryText(document: PipelineDocument, queryText: string): boolean {
  return document.path.toLowerCase().includes(queryText)
    || document.basename.toLowerCase().includes(queryText)
    || document.rawText.toLowerCase().includes(queryText);
}
