import { MarkdownPostProcessorContext, Plugin, TFile } from 'obsidian';
import type { TagMatchMode, WordCloudServices } from '../types';

type EmbeddedWordCloudMode = 'current-file' | 'specific-file' | 'tag-based';

type EmbeddedWordCloudOptions = {
  mode: EmbeddedWordCloudMode;
  tags: string[];
  match: TagMatchMode;
  height: number;
  interactions: boolean;
  filePath?: string;
};

type EmbeddedRenderState = {
  observer: ResizeObserver;
  rerenderTimer: number | null;
  lastWidth: number;
  lastHeight: number;
};

const DEFAULT_OPTIONS: EmbeddedWordCloudOptions = {
  mode: 'current-file',
  tags: [],
  match: 'any',
  height: 320,
  interactions: true,
};

const EMBED_RESIZE_DEBOUNCE_MS = 140;
const embeddedRenderStates = new WeakMap<HTMLElement, EmbeddedRenderState>();

export function registerEmbeddedWordCloudProcessor(
  plugin: Plugin,
  services: WordCloudServices,
): void {
  const render = async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> => {
    cleanupEmbeddedRenderState(el);
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

      if (options.mode === 'current-file') {
        const file = resolveCurrentFile(plugin, ctx);
        if (!file) {
          stateEl.setText('Could not resolve the current file for this embedded cloud.');
          return;
        }

        words = await services.collectFileWords(file, updateProgress);
        searchScope = { filePath: file.path };
      } else if (options.mode === 'specific-file') {
        if (!options.filePath) {
          stateEl.setText('Set `file:` when using `mode: specific-file`.');
          return;
        }

        const file = resolveSpecificFile(plugin, options.filePath);
        if (!file) {
          stateEl.setText('Could not find the file for this embedded cloud.');
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
        enableOverlayControls: true,
        enableViewportInteraction: options.interactions,
        showRefreshControl: true,
        showZoomControls: options.interactions,
        onWordClick: (word) => {
          void services.openSearchForWord(word, searchScope);
        },
      });

      stateEl.remove();
      registerEmbeddedResizeObserver(el, canvasEl, () => render(source, el, ctx));
    } catch (error) {
      console.error('Word clouds: failed to render embedded cloud', error);
      stateEl.setText('Could not render embedded word cloud.');
    }
  };

  plugin.registerMarkdownCodeBlockProcessor('wordcloud', render);
  plugin.registerMarkdownCodeBlockProcessor('word-cloud', render);
}

function resolveCurrentFile(plugin: Plugin, ctx: MarkdownPostProcessorContext): TFile | null {
  const fromContext = plugin.app.vault.getAbstractFileByPath(ctx.sourcePath);
  return fromContext instanceof TFile ? fromContext : null;
}

function resolveSpecificFile(plugin: Plugin, filePath: string): TFile | null {
  const normalizedPath = filePath.trim();
  if (!normalizedPath) {
    return null;
  }

  const resolved = plugin.app.vault.getAbstractFileByPath(normalizedPath);
  return resolved instanceof TFile ? resolved : null;
}

function parseOptions(source: string): EmbeddedWordCloudOptions {
  const options: EmbeddedWordCloudOptions = { ...DEFAULT_OPTIONS };
  let modeWasExplicitlySet = false;
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

    if (rawKey === 'mode') {
      const parsedMode = parseModeOption(rawValue);
      if (parsedMode) {
        options.mode = parsedMode;
        modeWasExplicitlySet = true;
      }
      continue;
    }

    if (rawKey === 'scope' && !modeWasExplicitlySet) {
      const parsedMode = parseLegacyScopeOption(rawValue);
      if (parsedMode) {
        options.mode = parsedMode;
      }
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

    if (rawKey === 'interactions' || rawKey === 'interactable' || rawKey === 'controls') {
      options.interactions = parseBooleanOption(rawValue, true);
      continue;
    }

    if (rawKey === 'file' || rawKey === 'note' || rawKey === 'path' || rawKey === 'filename') {
      options.filePath = rawValue;
      if (!modeWasExplicitlySet) {
        options.mode = 'specific-file';
      }
    }
  }

  return options;
}

function parseModeOption(value: string): EmbeddedWordCloudMode | null {
  const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, '-');
  if (
    normalized === 'current-file'
    || normalized === 'current'
    || normalized === 'current-note'
    || normalized === 'note'
  ) {
    return 'current-file';
  }

  if (
    normalized === 'specific-file'
    || normalized === 'specific'
    || normalized === 'file'
    || normalized === 'note-file'
  ) {
    return 'specific-file';
  }

  if (
    normalized === 'tag-based'
    || normalized === 'tags'
    || normalized === 'tag'
    || normalized === 'vault'
  ) {
    return 'tag-based';
  }

  return null;
}

function parseLegacyScopeOption(value: string): EmbeddedWordCloudMode | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'vault') {
    return 'tag-based';
  }
  if (normalized === 'note') {
    return 'current-file';
  }
  return null;
}

function parseBooleanOption(value: string, fallback: boolean): boolean {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === 'yes' || normalized === 'on' || normalized === '1') {
    return true;
  }
  if (normalized === 'false' || normalized === 'no' || normalized === 'off' || normalized === '0') {
    return false;
  }
  return fallback;
}

function registerEmbeddedResizeObserver(
  hostEl: HTMLElement,
  canvasEl: HTMLDivElement,
  rerender: () => void,
): void {
  if (typeof ResizeObserver === 'undefined') {
    return;
  }

  const state: EmbeddedRenderState = {
    observer: new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const nextWidth = Math.round(entry.contentRect.width);
      const nextHeight = Math.round(entry.contentRect.height);
      if (nextWidth <= 0 || nextHeight <= 0) {
        return;
      }
      if (nextWidth === state.lastWidth && nextHeight === state.lastHeight) {
        return;
      }

      state.lastWidth = nextWidth;
      state.lastHeight = nextHeight;

      if (state.rerenderTimer !== null) {
        window.clearTimeout(state.rerenderTimer);
      }
      state.rerenderTimer = window.setTimeout(() => {
        state.rerenderTimer = null;
        rerender();
      }, EMBED_RESIZE_DEBOUNCE_MS);
    }),
    rerenderTimer: null,
    lastWidth: Math.round(canvasEl.clientWidth),
    lastHeight: Math.round(canvasEl.clientHeight),
  };

  state.observer.observe(canvasEl);
  embeddedRenderStates.set(hostEl, state);
}

function cleanupEmbeddedRenderState(hostEl: HTMLElement): void {
  const state = embeddedRenderStates.get(hostEl);
  if (!state) {
    return;
  }

  state.observer.disconnect();
  if (state.rerenderTimer !== null) {
    window.clearTimeout(state.rerenderTimer);
  }
  embeddedRenderStates.delete(hostEl);
}
