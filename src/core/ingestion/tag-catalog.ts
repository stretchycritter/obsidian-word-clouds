import type { App } from 'obsidian';

export function getAvailableTags(app: App): string[] {
  // `getTags()` is an undocumented internal Obsidian API that is not present in their
  // public TypeScript type definitions. The cast to an intersection type with an optional
  // `getTags` property lets us call it safely at runtime.
  // The optional-chaining `?.` with a fallback to `{}` handles the case where the method
  // has been removed in a future Obsidian version — if that happens, tag autocomplete will
  // silently show no suggestions rather than throwing an error and crashing the plugin.
  const tags = (app.metadataCache as { getTags?: () => Record<string, number> }).getTags?.() ?? {};
  return Object.keys(tags).sort((a, b) => a.localeCompare(b));
}
