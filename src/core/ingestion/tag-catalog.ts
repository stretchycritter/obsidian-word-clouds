import type { App } from 'obsidian';

export function getAvailableTags(app: App): string[] {
  const tags = (app.metadataCache as { getTags?: () => Record<string, number> }).getTags?.() ?? {};
  return Object.keys(tags).sort((a, b) => a.localeCompare(b));
}
