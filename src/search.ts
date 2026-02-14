import type { App } from 'obsidian';
import type { SearchOptions } from './types';
import { escapeForSearch, normalizeTag } from './utils';

export async function openSearchForWord(app: App, word: string, options: SearchOptions = {}): Promise<void> {
  const parts: string[] = [`"${escapeForSearch(word)}"`];

  if (options.filePath) {
    parts.push(`path:"${escapeForSearch(options.filePath)}"`);
  }

  const tags = (options.tags ?? [])
    .map((tag) => normalizeTag(tag))
    .filter((tag) => tag.length > 0);

  if (tags.length > 0) {
    if (options.tagMatchMode === 'all') {
      for (const tag of tags) {
        parts.push(tag);
      }
    } else {
      parts.push(`(${tags.join(' OR ')})`);
    }
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
