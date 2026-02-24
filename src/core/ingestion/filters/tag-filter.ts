import type { App, TFile } from 'obsidian';
import type { SourceSelectionRules, TagMatchMode } from '@/settings/types';
import { normalizeTag } from '@/utils/utils';
import { extractFrontmatterTags } from '@/utils/frontmatter-tags';

type FilePredicate = (file: TFile) => boolean;

export function compileTagPredicate(app: App, rules: SourceSelectionRules): FilePredicate | null {
  const includeTags = (rules.includeTags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean);
  const excludeTags = (rules.excludeTags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean);
  const includeTagPrefixes = (rules.includeTagPrefixes ?? []).map((tag) => normalizeTag(tag)).filter(Boolean);
  const excludeTagPrefixes = (rules.excludeTagPrefixes ?? []).map((tag) => normalizeTag(tag)).filter(Boolean);

  if (
    includeTags.length === 0
    && excludeTags.length === 0
    && includeTagPrefixes.length === 0
    && excludeTagPrefixes.length === 0
  ) {
    return null;
  }

  const includeSet = new Set(includeTags);
  const excludeSet = new Set(excludeTags);
  const tagMatchMode = rules.tagMatchMode ?? 'any';
  const tagPrefixMatchMode = rules.tagPrefixMatchMode ?? 'any';
  const tagCache = new Map<string, Set<string>>();

  return (file: TFile) => {
    const fileTags = getNormalizedFileTags(app, file, tagCache);
    if (includeSet.size > 0 && !matchesTagSet(fileTags, includeTags, tagMatchMode, false)) {
      return false;
    }

    if (excludeSet.size > 0 && matchesTagSet(fileTags, excludeTags, 'any', false)) {
      return false;
    }

    if (includeTagPrefixes.length > 0 && !matchesTagSet(fileTags, includeTagPrefixes, tagPrefixMatchMode, true)) {
      return false;
    }

    if (excludeTagPrefixes.length > 0 && matchesTagSet(fileTags, excludeTagPrefixes, 'any', true)) {
      return false;
    }

    return true;
  };
}

function matchesTagSet(fileTags: Set<string>, constraints: string[], mode: TagMatchMode, usePrefixMatch: boolean): boolean {
  if (constraints.length === 0) {
    return true;
  }

  const matchesTag = (constraint: string): boolean => {
    if (!usePrefixMatch) {
      return fileTags.has(constraint);
    }

    for (const tag of fileTags) {
      if (tag.startsWith(constraint)) {
        return true;
      }
    }

    return false;
  };

  if (mode === 'all') {
    return constraints.every(matchesTag);
  }

  return constraints.some(matchesTag);
}

function getNormalizedFileTags(app: App, file: TFile, tagCache: Map<string, Set<string>>): Set<string> {
  const cached = tagCache.get(file.path);
  if (cached) {
    return cached;
  }

  const cache = app.metadataCache.getFileCache(file);
  if (!cache) {
    const emptyTagSet = new Set<string>();
    tagCache.set(file.path, emptyTagSet);
    return emptyTagSet;
  }

  const normalizedInlineTags = (cache.tags ?? [])
    .map((entry) => normalizeTag(entry.tag))
    .filter(Boolean);
  const normalizedFrontmatterTags = extractFrontmatterTags(cache.frontmatter)
    .map((entry) => normalizeTag(entry))
    .filter(Boolean);

  const normalized = [...normalizedInlineTags, ...normalizedFrontmatterTags];
  const normalizedTagSet = new Set(normalized);
  tagCache.set(file.path, normalizedTagSet);
  return normalizedTagSet;
}
