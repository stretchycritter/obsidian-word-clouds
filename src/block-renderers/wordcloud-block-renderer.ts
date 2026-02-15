import { MarkdownPostProcessorContext, MarkdownView, Notice, Plugin, TFile } from 'obsidian';
import type { TagMatchMode, WordCloudServices } from '../types';
import { EmbedWordCloudModal } from '../modals/embed-word-cloud-modal';

type EmbeddedWordCloudScope = 'file' | 'vault';
type EmbeddedWordCloudSize = 'small' | 'medium' | 'large';

type EmbeddedWordCloudOptions = {
  scope: EmbeddedWordCloudScope;
  size: EmbeddedWordCloudSize;
  includeTags: string[];
  excludeWords: string[];
  interactions: boolean;
  specificFilePath?: string;
};

type EmbeddedRenderState = {
  observer: ResizeObserver;
  rerenderTimer: number | null;
  lastWidth: number;
  lastHeight: number;
};

type EmbeddedCloudInstance = {
  sourcePath: string;
  rerender: () => void;
};

const DEFAULT_OPTIONS: EmbeddedWordCloudOptions = {
  scope: 'file',
  size: 'medium',
  includeTags: [],
  excludeWords: [],
  interactions: true,
};

const EMBED_RESIZE_DEBOUNCE_MS = 140;
const EMBED_CONTENT_CHANGE_DEBOUNCE_MS = 5000;
const EMBED_SIZE_HEIGHT: Record<EmbeddedWordCloudSize, number> = {
  small: 240,
  medium: 320,
  large: 440,
};
const embeddedRenderStates = new WeakMap<HTMLElement, EmbeddedRenderState>();
const embeddedCloudInstances = new WeakMap<HTMLElement, EmbeddedCloudInstance>();
const embeddedCloudsBySourcePath = new Map<string, Set<HTMLElement>>();
const sourcePathRefreshTimers = new Map<string, number>();

export function registerEmbeddedWordCloudProcessor(
  plugin: Plugin,
  services: WordCloudServices,
): void {
  const render = async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> => {
    cleanupEmbeddedRenderState(el);
    registerEmbeddedCloudInstance(el, ctx.sourcePath, () => {
      void render(source, el, ctx);
    });
    const options = parseOptions(source);

    el.empty();
    const wrapperEl = el.createDiv({ cls: 'word-cloud-embed' });
    const stateEl = wrapperEl.createDiv({ cls: 'word-cloud-embed-state', text: 'Building cloud...' });
    const canvasEl = wrapperEl.createDiv({ cls: 'word-cloud-embed-canvas' });
    canvasEl.style.height = `${EMBED_SIZE_HEIGHT[options.size]}px`;

    const updateProgress = (message: string, percent: number): void => {
      stateEl.setText(`${message} (${percent}%)`);
    };

    try {
      let words;
      let searchScope: { filePath?: string; includeTags?: string[]; tagMatchMode?: TagMatchMode } = {};

      if (options.scope === 'file') {
        const file = options.specificFilePath
          ? resolveSpecificFile(plugin, options.specificFilePath)
          : resolveCurrentFile(plugin, ctx);
        if (!file) {
          stateEl.setText('Could not resolve the file for this embedded cloud.');
          return;
        }

        words = await services.collectFileWords(file, updateProgress, {
          excludeWords: options.excludeWords,
        });
        searchScope = { filePath: file.path };
      } else {
        words = await services.collectVaultWords({
          sourceRules: {
            scope: { mode: 'vault' },
            includeTags: options.includeTags,
            tagMatchMode: 'any',
          },
          excludeWords: options.excludeWords,
        }, updateProgress);
        searchScope = { includeTags: options.includeTags, tagMatchMode: 'any' };
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
        onExcludeInCloud: async (word) => {
          const changed = await updateEmbeddedCloudExcludedWords(plugin, ctx, el, source, word);
          if (changed) {
            new Notice(`Excluded "${word}" in this cloud.`);
          } else {
            new Notice(`"${word}" is already excluded in this cloud.`);
          }
        },
        onExcludeInVault: async (word) => {
          const added = await services.addBlacklistWord(word);
          new Notice(added ? `Excluded "${word}" from word clouds.` : `"${word}" is already excluded.`);
        },
        onEdit: () => {
          openEmbeddedWordCloudEditWizard(plugin, services, ctx, el, options);
        },
        enableOverlayControls: true,
        enableViewportInteraction: options.interactions,
        showRefreshControl: true,
        showZoomControls: options.interactions,
        showEditControl: true,
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
  plugin.registerEvent(plugin.app.workspace.on('editor-change', (_editor, view) => {
    if (!(view instanceof MarkdownView) || !view.file) {
      return;
    }

    scheduleSourcePathRefresh(view.file.path);
  }));
  plugin.register(() => {
    for (const timerId of sourcePathRefreshTimers.values()) {
      window.clearTimeout(timerId);
    }
    sourcePathRefreshTimers.clear();
    embeddedCloudsBySourcePath.clear();
  });
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
  let scopeWasExplicitlySet = false;
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
      const parsedScope = parseScopeOption(rawValue);
      if (parsedScope) {
        options.scope = parsedScope;
        scopeWasExplicitlySet = true;
      }
      continue;
    }

    if (rawKey === 'size') {
      const parsedSize = parseSizeOption(rawValue);
      if (parsedSize) {
        options.size = parsedSize;
      }
      continue;
    }

    if (rawKey === 'mode') {
      const parsedScope = parseLegacyModeOption(rawValue);
      if (parsedScope) {
        options.scope = parsedScope;
        scopeWasExplicitlySet = true;
      }
      continue;
    }

    if (rawKey === 'tags') {
      options.includeTags = rawValue
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
      continue;
    }

    if (
      rawKey === 'exclude'
      || rawKey === 'exclude-words'
      || rawKey === 'exclude_words'
      || rawKey === 'excluded-words'
    ) {
      options.excludeWords = rawValue
        .split(',')
        .map((value) => normalizeWord(value))
        .filter((value, index, arr) => value.length > 0 && arr.indexOf(value) === index);
      continue;
    }

    if (rawKey === 'height') {
      const parsed = Number.parseInt(rawValue, 10);
      if (!Number.isNaN(parsed)) {
        options.size = sizeFromHeight(parsed);
      }
      continue;
    }

    if (rawKey === 'interactions' || rawKey === 'interactable' || rawKey === 'controls') {
      options.interactions = parseBooleanOption(rawValue, true);
      continue;
    }

    if (rawKey === 'file' || rawKey === 'note' || rawKey === 'path' || rawKey === 'filename') {
      options.specificFilePath = rawValue;
      if (!scopeWasExplicitlySet) {
        options.scope = 'file';
      }
    }
  }

  return options;
}

function parseScopeOption(value: string): EmbeddedWordCloudScope | null {
  const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, '-');
  if (normalized === 'vault') {
    return 'vault';
  }

  if (normalized === 'file' || normalized === 'note' || normalized === 'current-note' || normalized === 'current-file') {
    return 'file';
  }

  return null;
}

function parseSizeOption(value: string): EmbeddedWordCloudSize | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'small' || normalized === 'medium' || normalized === 'large') {
    return normalized;
  }
  return null;
}

function parseLegacyModeOption(value: string): EmbeddedWordCloudScope | null {
  const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, '-');

  if (
    normalized === 'current-file'
    || normalized === 'current'
    || normalized === 'current-note'
    || normalized === 'note'
    || normalized === 'specific-file'
    || normalized === 'specific'
    || normalized === 'file'
    || normalized === 'note-file'
  ) {
    return 'file';
  }

  if (
    normalized === 'tag-based'
    || normalized === 'tags'
    || normalized === 'tag'
    || normalized === 'vault'
  ) {
    return 'vault';
  }

  return null;
}

function sizeFromHeight(height: number): EmbeddedWordCloudSize {
  const normalized = Math.min(900, Math.max(180, height));
  if (normalized <= 280) {
    return 'small';
  }
  if (normalized <= 380) {
    return 'medium';
  }
  return 'large';
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
    cleanupEmbeddedCloudInstance(hostEl);
    return;
  }

  state.observer.disconnect();
  if (state.rerenderTimer !== null) {
    window.clearTimeout(state.rerenderTimer);
  }
  embeddedRenderStates.delete(hostEl);
  cleanupEmbeddedCloudInstance(hostEl);
}

function registerEmbeddedCloudInstance(hostEl: HTMLElement, sourcePath: string, rerender: () => void): void {
  cleanupEmbeddedCloudInstance(hostEl);

  embeddedCloudInstances.set(hostEl, { sourcePath, rerender });
  let hosts = embeddedCloudsBySourcePath.get(sourcePath);
  if (!hosts) {
    hosts = new Set<HTMLElement>();
    embeddedCloudsBySourcePath.set(sourcePath, hosts);
  }
  hosts.add(hostEl);
}

function cleanupEmbeddedCloudInstance(hostEl: HTMLElement): void {
  const instance = embeddedCloudInstances.get(hostEl);
  if (!instance) {
    return;
  }

  const hosts = embeddedCloudsBySourcePath.get(instance.sourcePath);
  if (hosts) {
    hosts.delete(hostEl);
    if (hosts.size === 0) {
      embeddedCloudsBySourcePath.delete(instance.sourcePath);
    }
  }
  embeddedCloudInstances.delete(hostEl);
}

function scheduleSourcePathRefresh(sourcePath: string): void {
  const existingTimer = sourcePathRefreshTimers.get(sourcePath);
  if (existingTimer !== undefined) {
    window.clearTimeout(existingTimer);
  }

  const timerId = window.setTimeout(() => {
    sourcePathRefreshTimers.delete(sourcePath);
    rerenderEmbeddedCloudsForSourcePath(sourcePath);
  }, EMBED_CONTENT_CHANGE_DEBOUNCE_MS);
  sourcePathRefreshTimers.set(sourcePath, timerId);
}

function rerenderEmbeddedCloudsForSourcePath(sourcePath: string): void {
  const hosts = embeddedCloudsBySourcePath.get(sourcePath);
  if (!hosts || hosts.size === 0) {
    return;
  }

  for (const hostEl of [...hosts]) {
    if (!hostEl.isConnected) {
      cleanupEmbeddedCloudInstance(hostEl);
      continue;
    }

    const instance = embeddedCloudInstances.get(hostEl);
    if (!instance) {
      hosts.delete(hostEl);
      continue;
    }

    instance.rerender();
  }
}

function openEmbeddedWordCloudEditWizard(
  plugin: Plugin,
  services: WordCloudServices,
  ctx: MarkdownPostProcessorContext,
  hostEl: HTMLElement,
  options: EmbeddedWordCloudOptions,
): void {
  new EmbedWordCloudModal(
    plugin.app,
    services,
    async (embedBlock) => updateEmbeddedCodeBlock(plugin, ctx, hostEl, embedBlock),
    {
      title: 'Edit embedded word cloud',
      description: 'Update options for this embedded cloud without editing markdown manually.',
      submitButtonText: 'Save',
      initialState: {
        scope: options.scope,
        size: options.size,
        tagsRaw: options.includeTags.join(', '),
      },
    },
  ).open();
}

async function updateEmbeddedCodeBlock(
  plugin: Plugin,
  ctx: MarkdownPostProcessorContext,
  hostEl: HTMLElement,
  embedBlock: string,
): Promise<boolean> {
  const sourceFile = resolveCurrentFile(plugin, ctx);
  if (!sourceFile) {
    new Notice('Could not locate the source note for this embedded word cloud.');
    return false;
  }

  const section = ctx.getSectionInfo(hostEl);
  if (!section) {
    new Notice('Could not locate the embedded word cloud block to update.');
    return false;
  }

  await plugin.app.vault.process(sourceFile, (content) => replaceSectionWithBlock(content, section.lineStart, section.lineEnd, embedBlock));
  return true;
}

async function updateEmbeddedCloudExcludedWords(
  plugin: Plugin,
  ctx: MarkdownPostProcessorContext,
  hostEl: HTMLElement,
  source: string,
  word: string,
): Promise<boolean> {
  const normalizedWord = normalizeWord(word);
  if (!normalizedWord) {
    return false;
  }

  const updatedSource = addExcludedWordToEmbeddedSource(source, normalizedWord);
  if (updatedSource === source) {
    return false;
  }

  const embedBlock = buildWordCloudCodeBlock(updatedSource);
  return updateEmbeddedCodeBlock(plugin, ctx, hostEl, embedBlock);
}

function replaceSectionWithBlock(content: string, lineStart: number, lineEnd: number, embedBlock: string): string {
  const lines = content.split('\n');
  if (lineStart < 0 || lineEnd < lineStart || lineStart >= lines.length) {
    return content;
  }

  const replacementLines = embedBlock.replace(/\n$/, '').split('\n');
  const before = lines.slice(0, lineStart);
  const after = lines.slice(lineEnd + 1);
  return [...before, ...replacementLines, ...after].join('\n');
}

function addExcludedWordToEmbeddedSource(source: string, word: string): string {
  const lines = source.replace(/\n$/, '').split('\n');
  const excluded = extractExcludedWords(lines);

  if (excluded.includes(word)) {
    return source;
  }

  const nextExcluded = [...excluded, word];
  const replacementLine = `exclude-words: ${nextExcluded.join(', ')}`;
  const existingLineIndex = lines.findIndex((line) => {
    const key = getOptionKey(line);
    return key === 'exclude' || key === 'exclude-words' || key === 'exclude_words' || key === 'excluded-words';
  });

  if (existingLineIndex >= 0) {
    lines[existingLineIndex] = replacementLine;
  } else {
    lines.push(replacementLine);
  }

  return `${lines.join('\n')}\n`;
}

function buildWordCloudCodeBlock(source: string): string {
  const trimmed = source.replace(/\n$/, '');
  return `\`\`\`wordcloud\n${trimmed}\n\`\`\``;
}

function extractExcludedWords(lines: string[]): string[] {
  const entries: string[] = [];

  for (const line of lines) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    if (key !== 'exclude' && key !== 'exclude-words' && key !== 'exclude_words' && key !== 'excluded-words') {
      continue;
    }

    const rawValue = line.slice(separatorIndex + 1).trim();
    for (const value of rawValue.split(',')) {
      const normalized = normalizeWord(value);
      if (normalized && !entries.includes(normalized)) {
        entries.push(normalized);
      }
    }
  }

  return entries;
}

function getOptionKey(line: string): string {
  const separatorIndex = line.indexOf(':');
  if (separatorIndex === -1) {
    return '';
  }

  return line.slice(0, separatorIndex).trim().toLowerCase();
}

function normalizeWord(value: string): string {
  return value.trim().toLowerCase();
}
