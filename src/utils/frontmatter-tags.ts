import type { FrontMatterCache } from 'obsidian';

/**
 * Extracts tags from a frontmatter cache entry, normalizing them to a flat string array.
 * Handles both string values and array values, and returns an empty array for missing/null data.
 *
 * Shared utility — previously duplicated in obsidian-source.ts and filters/tag-filter.ts.
 */
export function extractFrontmatterTags(frontmatter: FrontMatterCache | null | undefined): string[] {
  const raw: unknown = frontmatter?.tags;
  if (!raw) {
    return [];
  }
  if (typeof raw === 'string') {
    return raw.trim() ? [raw.trim()] : [];
  }
  if (Array.isArray(raw)) {
    return raw
      .filter((t): t is string => typeof t === 'string' && t.trim() !== '')
      .map((t) => t.trim());
  }
  return [];
}
