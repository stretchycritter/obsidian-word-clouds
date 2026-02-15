import type { App } from 'obsidian';
import type { SearchOptions } from '../types';
import { escapeForSearch, normalizeTag } from '../utils';

export async function openSearchForWord(app: App, word: string, options: SearchOptions = {}): Promise<void> {
  const parts: string[] = [`"${escapeForSearch(word)}"`];

  if (options.filePath) {
    parts.push(`path:"${escapeForSearch(options.filePath)}"`);
  }

  const includeTags = (options.includeTags ?? [])
    .map((tag) => normalizeTag(tag))
    .filter((tag) => tag.length > 0);
  const excludeTags = (options.excludeTags ?? [])
    .map((tag) => normalizeTag(tag))
    .filter((tag) => tag.length > 0);

  if (includeTags.length > 0) {
    if (options.tagMatchMode === 'all') {
      for (const tag of includeTags) {
        parts.push(tag);
      }
    } else {
      parts.push(`(${includeTags.join(' OR ')})`);
    }
  }

  for (const tag of excludeTags) {
    parts.push(`-${tag}`);
  }

  const query = parts.join(' ');
  const existingSearchLeaf = app.workspace.getLeavesOfType('search')[0];
  const searchLeaf = existingSearchLeaf ?? app.workspace.getRightLeaf(false) ?? app.workspace.getLeaf(true);

  if (!searchLeaf) {
    return;
  }

  await searchLeaf.setViewState({
    type: 'search',
    active: true,
    state: {
      query,
    },
  });

  app.workspace.revealLeaf(searchLeaf);
}
