import { MarkdownPostProcessorContext, MarkdownView, Notice, Plugin, TFile } from 'obsidian';
import type {
  FrontmatterOperator,
  FrontmatterRule,
  PerformanceMode,
  RenderSettings,
  RotationPreset,
  ScalingMode,
  SourceScope,
  SpiralType,
  TagMatchMode,
  WordTextMetric,
} from '@/settings/types';
import type { WordCloudServices } from '@/services/types';
import { EmbedWordCloudModal } from '@/ui';
import { normalizeTag } from '@/utils/utils';
import { renderWordCloudCanvas } from '@/core';
import { t } from '@/i18n';

type EmbeddedWordCloudScope = 'file' | 'vault' | 'folder';
type EmbeddedWordCloudSize = 'small' | 'medium' | 'large';

type EmbeddedWordCloudOptions = {
  cloudId: string;
  scope: EmbeddedWordCloudScope;
  size: EmbeddedWordCloudSize;
  includeTags: string[];
  excludeTags: string[];
  tagMatchMode: TagMatchMode;
  folderPaths: string[];
  frontmatterRules: FrontmatterRule[];
  minCount: number;
  maxCount: number;
  excludeWords: string[];
  interactions: boolean;
  renderSettingsOverride: Partial<RenderSettings>;
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
  cloudId: '',
  scope: 'file',
  size: 'medium',
  includeTags: [],
  excludeTags: [],
  tagMatchMode: 'any',
  folderPaths: [],
  frontmatterRules: [],
  minCount: 1,
  maxCount: 9999,
  excludeWords: [],
  interactions: true,
  renderSettingsOverride: {},
};

const FRONTMATTER_OPERATORS = new Set<FrontmatterOperator>([
  'equals',
  'not-equals',
  'contains',
  'gt',
  'gte',
  'lt',
  'lte',
  'exists',
  'not-exists',
]);

const EMBED_RESIZE_DEBOUNCE_MS = 140;
const EMBED_CONTENT_CHANGE_DEBOUNCE_MS = 5000;
const EMBED_SIZE_HEIGHT: Record<EmbeddedWordCloudSize, number> = {
  small: 240,
  medium: 320,
  large: 440,
};
const embeddedRenderStates = new WeakMap<HTMLElement, EmbeddedRenderState>();
const embeddedRenderNonces = new WeakMap<HTMLElement, { value: number }>();
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
    const nonceRef = embeddedRenderNonces.get(el) ?? { value: 0 };
    embeddedRenderNonces.set(el, nonceRef);

    el.empty();
    const wrapperEl = el.createDiv({ cls: 'word-cloud-embed' });
    const canvasEl = wrapperEl.createDiv({ cls: 'word-cloud-embed-canvas' });
    canvasEl.style.height = `${EMBED_SIZE_HEIGHT[options.size]}px`;

    try {
      const sourceScope = resolveSourceScope(plugin, ctx, options);
      if (options.scope === 'file' && !sourceScope.activeFilePath) {
        wrapperEl.createDiv({
          cls: 'word-cloud-embed-state',
          text: t('ui.blocks.embed.resolveFileError'),
        });
        return;
      }
      if (options.scope === 'folder' && (sourceScope.folderPaths?.length ?? 0) === 0) {
        wrapperEl.createDiv({
          cls: 'word-cloud-embed-state',
          text: t('ui.blocks.embed.folderScopeNeedsPath'),
        });
        return;
      }

      let searchScope: { filePath?: string; includeTags?: string[]; excludeTags?: string[]; tagMatchMode?: TagMatchMode } = {};
      if (options.scope === 'file' && sourceScope.activeFilePath) {
        searchScope = { filePath: sourceScope.activeFilePath };
      } else {
        searchScope = {
          includeTags: options.includeTags,
          excludeTags: options.excludeTags,
          tagMatchMode: options.tagMatchMode,
        };
      }

      await renderWordCloudCanvas({
        nonceRef,
        containerEl: canvasEl,
        services,
        errorLogPrefix: 'Word clouds',
        createStatusHandle: (initialText) => {
          const stateEl = wrapperEl.createDiv({ cls: 'word-cloud-embed-state', text: initialText });
          return {
            setText: (text) => stateEl.setText(text),
            remove: () => stateEl.remove(),
          };
        },
        renderEmptyState: (message) => {
          wrapperEl.createDiv({ cls: 'word-cloud-embed-state', text: message });
        },
        renderErrorState: (message) => {
          wrapperEl.createDiv({ cls: 'word-cloud-embed-state', text: message });
        },
        resolveScopeFilePath: () => sourceScope.activeFilePath ?? '',
        resolveExtraContext: () => ({ sourceScope }),
        getAriaLabel: () => t('ui.blocks.embed.ariaLabel'),
        getNoWordsMessage: () => t('ui.blocks.embed.noWords'),
        getRenderSettingsOverride: () => options.renderSettingsOverride,
        getWords: async (_context, updateProgress, renderSettingsOverride) => {
          return services.collectVaultWords({
            sourceRules: {
              scope: sourceScope,
              includeTags: options.includeTags,
              excludeTags: options.excludeTags,
              tagMatchMode: options.tagMatchMode,
              frontmatterRules: options.frontmatterRules,
            },
            frequency: {
              minCount: options.minCount,
              maxCount: options.maxCount,
            },
            excludeWords: options.excludeWords,
            renderSettingsOverride,
          }, updateProgress);
        },
        onWordClick: (word) => {
          void services.openSearchForWord(word, searchScope);
        },
        getDrawOptions: () => ({
          onExcludeInCloud: async (word) => {
            const changed = await updateEmbeddedCloudExcludedWords(plugin, ctx, el, source, word);
            if (changed) {
              new Notice(t('notices.excludedInThisCloud').replace('{word}', word));
            } else {
              new Notice(t('notices.wordAlreadyExcludedInThisCloud').replace('{word}', word));
            }
          },
          onExcludeInVault: async (word) => {
            const added = await services.addExclusionListWord(word);
            new Notice(
              added
                ? t('notices.excludedFromWordClouds').replace('{word}', word)
                : t('notices.wordAlreadyExcluded').replace('{word}', word),
            );
          },
          onEdit: () => {
            openEmbeddedWordCloudEditWizard(plugin, services, ctx, el, options);
          },
          enableOverlayControls: true,
          enableViewportInteraction: options.interactions,
          showRefreshControl: true,
          showZoomControls: options.interactions,
          showEditControl: true,
        }),
        onRefresh: () => render(source, el, ctx),
        onAfterRender: () => {
          registerEmbeddedResizeObserver(el, canvasEl, () => render(source, el, ctx));
        },
      });
    } catch (error) {
      console.error('Word clouds: failed to render embedded cloud', error);
      wrapperEl.createDiv({ cls: 'word-cloud-embed-state', text: t('ui.blocks.embed.renderError') });
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

function resolveSourceScope(
  plugin: Plugin,
  ctx: MarkdownPostProcessorContext,
  options: EmbeddedWordCloudOptions,
): SourceScope {
  if (options.scope === 'file') {
    const file = options.specificFilePath
      ? resolveSpecificFile(plugin, options.specificFilePath)
      : resolveCurrentFile(plugin, ctx);
    return {
      mode: 'active-file',
      activeFilePath: file?.path ?? '',
      folderPaths: [],
    };
  }

  if (options.scope === 'folder') {
    return {
      mode: 'folder',
      activeFilePath: '',
      folderPaths: [...options.folderPaths],
    };
  }

  return {
    mode: 'vault',
    activeFilePath: '',
    folderPaths: [],
  };
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

    if (rawKey === 'id' || rawKey === 'cloud-id' || rawKey === 'cloud_id' || rawKey === 'guid') {
      options.cloudId = rawValue.trim();
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

    if (rawKey === 'tags' || rawKey === 'include-tags' || rawKey === 'include_tags') {
      options.includeTags = parseTagList(rawValue);
      continue;
    }

    if (rawKey === 'exclude-tags' || rawKey === 'exclude_tags') {
      options.excludeTags = parseTagList(rawValue);
      continue;
    }

    if (rawKey === 'match' || rawKey === 'tag-match' || rawKey === 'tag_match') {
      options.tagMatchMode = rawValue.trim().toLowerCase() === 'all' ? 'all' : 'any';
      continue;
    }

    if (rawKey === 'folder-paths' || rawKey === 'folder_paths' || rawKey === 'folders') {
      options.folderPaths = parseList(rawValue);
      if (!scopeWasExplicitlySet) {
        options.scope = 'folder';
      }
      continue;
    }

    if (rawKey === 'frontmatter-rules' || rawKey === 'frontmatter_rules') {
      options.frontmatterRules = parseFrontmatterRules(rawValue);
      continue;
    }

    if (rawKey === 'min-count' || rawKey === 'min_count') {
      options.minCount = parseFrequencyCount(rawValue, options.minCount);
      continue;
    }

    if (rawKey === 'max-count' || rawKey === 'max_count') {
      options.maxCount = parseFrequencyCount(rawValue, options.maxCount);
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
      continue;
    }

    if (parseRenderSettingOption(rawKey, rawValue, options.renderSettingsOverride)) {
      continue;
    }
  }

  options.excludeTags = options.excludeTags.filter((tag) => !options.includeTags.includes(tag));
  options.minCount = Math.min(options.minCount, options.maxCount);
  options.maxCount = Math.max(options.minCount, options.maxCount);

  return options;
}

const ROTATION_PRESETS = new Set<RotationPreset>([
  'horizontal',
  'mostly-horizontal',
  'mixed',
  'vertical',
]);

const SPIRAL_TYPES = new Set<SpiralType>([
  'archimedean',
  'rectangular',
]);

const SCALING_MODES = new Set<ScalingMode>([
  'linear',
  'power',
  'log',
  'rank',
]);

const WORD_TEXT_METRICS = new Set<WordTextMetric>([
  'count',
  'frequency',
]);

const PERFORMANCE_MODES = new Set<PerformanceMode>([
  'full-speed',
  'balanced',
  'throttled',
]);

function parseRenderSettingOption(
  rawKey: string,
  rawValue: string,
  target: Partial<RenderSettings>,
): boolean {
  const key = rawKey.trim().toLowerCase().replace(/_/g, '-');
  const value = rawValue.trim();

  const setNumber = (
    setter: (next: number) => void,
    minimum?: number,
    maximum?: number,
  ): boolean => {
    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) {
      return false;
    }
    const bounded = Math.min(maximum ?? parsed, Math.max(minimum ?? parsed, parsed));
    setter(bounded);
    return true;
  };

  const setInteger = (
    setter: (next: number) => void,
    minimum?: number,
    maximum?: number,
  ): boolean => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return false;
    }
    const bounded = Math.min(maximum ?? parsed, Math.max(minimum ?? parsed, parsed));
    setter(bounded);
    return true;
  };

  const setBoolean = (setter: (next: boolean) => void): boolean => {
    const parsed = parseBooleanOption(value, false);
    if (
      value.toLowerCase() !== 'true'
      && value.toLowerCase() !== 'yes'
      && value.toLowerCase() !== 'on'
      && value !== '1'
      && value.toLowerCase() !== 'false'
      && value.toLowerCase() !== 'no'
      && value.toLowerCase() !== 'off'
      && value !== '0'
    ) {
      return false;
    }
    setter(parsed);
    return true;
  };

  const normalizedEnum = value.toLowerCase().replace(/\s+/g, '-');

  if (key === 'rotation' || key === 'rotation-preset') {
    if (!ROTATION_PRESETS.has(normalizedEnum as RotationPreset)) {
      return false;
    }
    target.rotationPreset = normalizedEnum as RotationPreset;
    return true;
  }

  if (key === 'spiral') {
    if (!SPIRAL_TYPES.has(normalizedEnum as SpiralType)) {
      return false;
    }
    target.spiral = normalizedEnum as SpiralType;
    return true;
  }

  if (key === 'word-padding' || key === 'padding') {
    return setNumber((next) => {
      target.wordPadding = next;
    }, 0);
  }

  if (key === 'min-font-size' || key === 'min-font') {
    return setNumber((next) => {
      target.minFontSize = next;
    }, 1);
  }

  if (key === 'max-font-size' || key === 'max-font') {
    return setNumber((next) => {
      target.maxFontSize = next;
    }, 1);
  }

  if (key === 'font' || key === 'font-family') {
    if (!value) {
      return false;
    }
    target.fontFamily = value;
    return true;
  }

  if (key === 'scaling' || key === 'scaling-mode') {
    if (!SCALING_MODES.has(normalizedEnum as ScalingMode)) {
      return false;
    }
    target.scalingMode = normalizedEnum as ScalingMode;
    return true;
  }

  if (key === 'emphasis') {
    return setNumber((next) => {
      target.emphasis = next;
    }, 0.1);
  }

  if (key === 'show-count-in-word-text' || key === 'show-count-labels') {
    return setBoolean((next) => {
      target.showCountInWordText = next;
    });
  }

  if (key === 'word-text-metric' || key === 'text-metric') {
    if (!WORD_TEXT_METRICS.has(normalizedEnum as WordTextMetric)) {
      return false;
    }
    target.wordTextMetric = normalizedEnum as WordTextMetric;
    return true;
  }

  if (key === 'show-word-text-metric-toggle' || key === 'show-metric-toggle') {
    return setBoolean((next) => {
      target.showWordTextMetricToggle = next;
    });
  }

  if (key === 'count-label-min-count' || key === 'min-count-label') {
    return setInteger((next) => {
      target.countLabelMinCount = next;
    }, 1);
  }

  if (key === 'performance-mode' || key === 'performance') {
    if (!PERFORMANCE_MODES.has(normalizedEnum as PerformanceMode)) {
      return false;
    }
    target.performanceMode = normalizedEnum as PerformanceMode;
    return true;
  }

  if (key === 'scan-batch-size' || key === 'batch-size') {
    return setInteger((next) => {
      target.scanBatchSize = next;
    }, 1);
  }

  if (key === 'layout-time-interval-ms' || key === 'layout-interval-ms') {
    return setInteger((next) => {
      target.layoutTimeIntervalMs = next;
    }, 0);
  }

  if (key === 'deterministic-layout' || key === 'deterministic') {
    return setBoolean((next) => {
      target.deterministicLayout = next;
    });
  }

  if (key === 'random-seed' || key === 'seed') {
    return setInteger((next) => {
      target.randomSeed = next;
    });
  }

  if (key === 'enable-mouse-interactions' || key === 'mouse-interactions') {
    return setBoolean((next) => {
      target.enableMouseInteractions = next;
    });
  }

  if (key === 'enable-controls' || key === 'overlay-controls') {
    return setBoolean((next) => {
      target.enableControls = next;
    });
  }

  if (key === 'enable-exporting' || key === 'exporting') {
    return setBoolean((next) => {
      target.enableExporting = next;
    });
  }

  return false;
}

function parseScopeOption(value: string): EmbeddedWordCloudScope | null {
  const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, '-');
  if (normalized === 'vault') {
    return 'vault';
  }

  if (normalized === 'folder' || normalized === 'folders') {
    return 'folder';
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

  if (normalized === 'folder' || normalized === 'folders') {
    return 'folder';
  }

  return null;
}

function parseTagList(rawValue: string): string[] {
  const tags = new Set<string>();
  for (const value of parseList(rawValue)) {
    const normalized = normalizeTag(value);
    if (normalized) {
      tags.add(normalized);
    }
  }
  return [...tags];
}

function parseList(rawValue: string): string[] {
  const values = rawValue
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  return [...new Set(values)];
}

function parseFrequencyCount(rawValue: string, fallback: number): number {
  const parsed = Number.parseInt(rawValue.trim(), 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(9999, Math.max(1, parsed));
}

function parseFrontmatterRules(rawValue: string): FrontmatterRule[] {
  const rules: FrontmatterRule[] = [];
  const entries = rawValue
    .split(';')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  for (const entry of entries) {
    const parts = entry.split('|').map((part) => part.trim());
    const key = parts[0] ?? '';
    if (!key) {
      continue;
    }

    const operator = FRONTMATTER_OPERATORS.has(parts[1] as FrontmatterOperator)
      ? parts[1] as FrontmatterOperator
      : 'equals';
    const value = parts.slice(2).join('|').trim();

    if (operator === 'exists' || operator === 'not-exists') {
      rules.push({ key, operator });
    } else {
      rules.push({ key, operator, value });
    }
  }

  return rules;
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
    async (embedBlock) => updateEmbeddedCodeBlock(plugin, ctx, hostEl, embedBlock, options.cloudId),
    {
      title: t('ui.blocks.embed.editTitle'),
      description: t('ui.blocks.embed.editDescription'),
      submitButtonText: t('ui.modals.embed.apply'),
      initialState: {
        cloudId: options.cloudId,
        scope: options.scope,
        size: options.size,
        specificFilePath: options.specificFilePath ?? '',
        includeTagsRaw: options.includeTags.join(', '),
        excludeTagsRaw: options.excludeTags.join(', '),
        tagMatchMode: options.tagMatchMode,
        folderPathsRaw: options.folderPaths.join(', '),
        frontmatterRulesRaw: options.frontmatterRules
          .map((rule) => `${rule.key}|${rule.operator}|${rule.value ?? ''}`)
          .join('; '),
        minCountRaw: `${options.minCount}`,
        maxCountRaw: `${options.maxCount}`,
      },
    },
  ).open();
}

async function updateEmbeddedCodeBlock(
  plugin: Plugin,
  ctx: MarkdownPostProcessorContext,
  hostEl: HTMLElement,
  embedBlock: string,
  cloudId?: string,
): Promise<boolean> {
  const sourceFile = resolveCurrentFile(plugin, ctx);
  if (!sourceFile) {
    new Notice(t('ui.blocks.embed.sourceNoteNotFound'));
    return false;
  }

  let updated = false;
  await plugin.app.vault.process(sourceFile, (content) => {
    const byId = cloudId
      ? replaceWordCloudBlockById(content, cloudId, embedBlock)
      : null;
    if (byId !== null) {
      updated = true;
      return byId;
    }

    const section = ctx.getSectionInfo(hostEl);
    if (!section) {
      return content;
    }

    updated = true;
    return replaceSectionWithBlock(content, section.lineStart, section.lineEnd, embedBlock);
  });
  if (!updated) {
    new Notice(t('ui.blocks.embed.blockNotFoundToUpdate'));
  }
  return updated;
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
  return updateEmbeddedCodeBlock(plugin, ctx, hostEl, embedBlock, extractCloudIdFromSource(updatedSource));
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

function replaceWordCloudBlockById(content: string, cloudId: string, embedBlock: string): string | null {
  const targetId = cloudId.trim();
  if (!targetId) {
    return null;
  }

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const fence = lines[i]?.trim().toLowerCase();
    if (fence !== '```wordcloud' && fence !== '```word-cloud') {
      continue;
    }

    let end = i + 1;
    while (end < lines.length && lines[end]?.trim() !== '```') {
      end += 1;
    }
    if (end >= lines.length) {
      continue;
    }

    const source = lines.slice(i + 1, end).join('\n');
    const blockId = extractCloudIdFromSource(source);
    if (blockId !== targetId) {
      i = end;
      continue;
    }

    const replacementLines = embedBlock.replace(/\n$/, '').split('\n');
    const before = lines.slice(0, i);
    const after = lines.slice(end + 1);
    return [...before, ...replacementLines, ...after].join('\n');
  }

  return null;
}

function extractCloudIdFromSource(source: string): string {
  const lines = source.split('\n');
  for (const line of lines) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    if (key !== 'id' && key !== 'cloud-id' && key !== 'cloud_id' && key !== 'guid') {
      continue;
    }

    return line.slice(separatorIndex + 1).trim();
  }

  return '';
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
