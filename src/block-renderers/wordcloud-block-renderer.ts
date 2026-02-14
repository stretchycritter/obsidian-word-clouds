import { MarkdownPostProcessorContext, Plugin, TFile } from 'obsidian';
import type { TagMatchMode, WordCloudServices } from '../types';

type EmbeddedWordCloudOptions = {
  scope: 'note' | 'vault';
  tags: string[];
  match: TagMatchMode;
  height: number;
  notePath?: string;
};

const DEFAULT_OPTIONS: EmbeddedWordCloudOptions = {
  scope: 'note',
  tags: [],
  match: 'any',
  height: 320,
};

export function registerEmbeddedWordCloudProcessor(
  plugin: Plugin,
  services: WordCloudServices,
): void {
  const render = async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> => {
    const options = parseOptions(source);

    el.empty();
    const wrapperEl = el.createDiv({ cls: 'word-cloud-embed' });
    const stateEl = wrapperEl.createDiv({ cls: 'word-cloud-embed-state', text: 'Building cloud...' });
    const canvasEl = wrapperEl.createDiv({ cls: 'word-cloud-embed-canvas' });
    canvasEl.style.height = `${options.height}px`;

    const updateProgress = (message: string, percent: number): void => {
      stateEl.setText(`${message} (${percent}%)`);
    };

    try {
      let words;
      let searchScope: { filePath?: string; tags?: string[]; tagMatchMode?: TagMatchMode } = {};

      if (options.scope === 'note') {
        const file = resolveTargetFile(plugin, ctx, options.notePath);
        if (!file) {
          stateEl.setText('Could not find note for embedded word cloud.');
          return;
        }

        words = await services.collectFileWords(file, updateProgress);
        searchScope = { filePath: file.path };
      } else {
        words = await services.collectVaultWords(options.tags, options.match, updateProgress);
        searchScope = { tags: options.tags, tagMatchMode: options.match };
      }

      if (words.length === 0) {
        stateEl.setText('No words found for this embedded cloud.');
        return;
      }

      await services.drawWordCloud({
        containerEl: canvasEl,
        words,
        ariaLabel: 'Embedded word cloud',
        onProgress: updateProgress,
        onRefresh: () => render(source, el, ctx),
        onWordClick: (word) => {
          void services.openSearchForWord(word, searchScope);
        },
      });

      stateEl.remove();
    } catch (error) {
      console.error('Word clouds: failed to render embedded cloud', error);
      stateEl.setText('Could not render embedded word cloud.');
    }
  };

  plugin.registerMarkdownCodeBlockProcessor('wordcloud', render);
  plugin.registerMarkdownCodeBlockProcessor('word-cloud', render);
}

function resolveTargetFile(plugin: Plugin, ctx: MarkdownPostProcessorContext, notePath?: string): TFile | null {
  if (notePath) {
    const normalizedPath = notePath.trim();
    const resolved = plugin.app.vault.getAbstractFileByPath(normalizedPath);
    return resolved instanceof TFile ? resolved : null;
  }

  const fromContext = plugin.app.vault.getAbstractFileByPath(ctx.sourcePath);
  return fromContext instanceof TFile ? fromContext : null;
}

function parseOptions(source: string): EmbeddedWordCloudOptions {
  const options: EmbeddedWordCloudOptions = { ...DEFAULT_OPTIONS };
  const lines = source.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const rawKey = trimmed.slice(0, separatorIndex).trim().toLowerCase();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();

    if (rawKey === 'scope') {
      options.scope = rawValue.toLowerCase() === 'vault' ? 'vault' : 'note';
      continue;
    }

    if (rawKey === 'match') {
      options.match = rawValue.toLowerCase() === 'all' ? 'all' : 'any';
      continue;
    }

    if (rawKey === 'tags') {
      options.tags = rawValue
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
      continue;
    }

    if (rawKey === 'height') {
      const parsed = Number.parseInt(rawValue, 10);
      if (!Number.isNaN(parsed)) {
        options.height = Math.min(900, Math.max(180, parsed));
      }
      continue;
    }

    if (rawKey === 'note') {
      options.notePath = rawValue;
    }
  }

  return options;
}
