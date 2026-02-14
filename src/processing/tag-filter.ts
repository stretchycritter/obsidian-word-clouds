import type { App, TFile } from 'obsidian';
import type { TagMatchMode } from '../types';
import { normalizeTag } from '../utils';

export function getAvailableTags(app: App): string[] {
  const tags = app.metadataCache.getTags();
  return Object.keys(tags).sort((a, b) => a.localeCompare(b));
}

export function filterFilesByTags(
  app: App,
  files: TFile[],
  tagFilters: string[],
  tagMatchMode: TagMatchMode,
): TFile[] {
  const normalizedFilters = tagFilters
    .map((tag) => normalizeTag(tag))
    .filter((tag) => tag.length > 0);

  if (normalizedFilters.length === 0) {
    return files;
  }

  return files.filter((file) => fileMatchesTags(app, file, normalizedFilters, tagMatchMode));
}

function fileMatchesTags(app: App, file: TFile, normalizedFilters: string[], tagMatchMode: TagMatchMode): boolean {
  const cache = app.metadataCache.getFileCache(file);
  if (!cache) {
    return false;
  }

  const tagSet = new Set<string>();

  if (cache.tags) {
    for (const tagEntry of cache.tags) {
      const normalized = normalizeTag(tagEntry.tag);
      if (normalized) {
        tagSet.add(normalized);
      }
    }
  }

  for (const tag of extractFrontmatterTags(cache.frontmatter)) {
    const normalized = normalizeTag(tag);
    if (normalized) {
      tagSet.add(normalized);
    }
  }

  if (tagMatchMode === 'all') {
    return normalizedFilters.every((tag) => tagSet.has(tag));
  }

  return normalizedFilters.some((tag) => tagSet.has(tag));
}

function extractFrontmatterTags(frontmatter: Record<string, unknown> | null | undefined): string[] {
  if (!frontmatter || typeof frontmatter !== 'object') {
    return [];
  }

  const rawTags = frontmatter.tags ?? frontmatter.tag;
  if (typeof rawTags === 'string') {
    return rawTags.split(/[\s,]+/).filter((entry) => entry.length > 0);
  }

  if (Array.isArray(rawTags)) {
    return rawTags
      .filter((entry): entry is string => typeof entry === 'string')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }

  return [];
}
