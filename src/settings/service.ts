import type { Plugin } from 'obsidian';
import type {
  RenderSettings,
  TagMatchMode,
  WordCloudFilterSettings,
} from '../types';
import type { FrontmatterRule, SourceScope } from '../wordcloud/pipeline/types';
import { normalizeTag } from '../utils/utils';
import { DEFAULT_SETTINGS, type WordCloudSettings } from './types';

export type SettingsChangeListener = (settings: Readonly<WordCloudSettings>) => void;

export class SettingsService {
  private settings: WordCloudSettings = cloneSettings(DEFAULT_SETTINGS);
  private readonly listeners = new Set<SettingsChangeListener>();

  constructor(private readonly plugin: Plugin) {}

  async load(): Promise<void> {
    const loaded = await this.plugin.loadData();
    const raw = (loaded && typeof loaded === 'object') ? loaded as { exclusionListWords?: unknown; render?: unknown; filters?: unknown } : {};
    this.settings = {
      exclusionListWords: this.normalizeExclusionListWords(raw.exclusionListWords),
      render: this.normalizeRenderSettings(raw.render),
      filters: this.normalizeFilterSettings(raw.filters),
    };
  }

  getSnapshot(): Readonly<WordCloudSettings> {
    return cloneSettings(this.settings);
  }

  onChange(callback: SettingsChangeListener): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  dispose(): void {
    this.listeners.clear();
  }

  getExclusionListSet(): Set<string> {
    return new Set(this.settings.exclusionListWords.map((word) => this.normalizeExclusionListWord(word)).filter(Boolean));
  }

  async updateFilters(patch: Partial<WordCloudFilterSettings>): Promise<void> {
    const merged: WordCloudFilterSettings = {
      ...this.settings.filters,
      ...patch,
      scope: {
        ...this.settings.filters.scope,
        ...patch.scope,
      },
      frequency: {
        ...this.settings.filters.frequency,
        ...patch.frequency,
      },
      includeTags: patch.includeTags ?? this.settings.filters.includeTags,
      excludeTags: patch.excludeTags ?? this.settings.filters.excludeTags,
      frontmatterRules: patch.frontmatterRules ?? this.settings.filters.frontmatterRules,
    };

    this.settings = {
      ...this.settings,
      filters: this.normalizeFilterSettings(merged),
    };
    await this.persist();
  }

  async updateRenderSettings(patch: Partial<RenderSettings>): Promise<void> {
    const merged = {
      ...this.settings.render,
      ...patch,
    };

    this.settings = {
      ...this.settings,
      render: this.normalizeRenderSettings(merged),
    };
    await this.persist();
  }

  async resetRenderSettings(): Promise<void> {
    this.settings = {
      ...this.settings,
      render: { ...DEFAULT_SETTINGS.render },
    };
    await this.persist();
  }

  async addExclusionListWord(rawWord: string): Promise<boolean> {
    const normalizedWord = this.normalizeExclusionListWord(rawWord);
    if (!normalizedWord || this.settings.exclusionListWords.includes(normalizedWord)) {
      return false;
    }

    this.settings = {
      ...this.settings,
      exclusionListWords: this.sortExclusionListWords([...this.settings.exclusionListWords, normalizedWord]),
    };
    await this.persist();
    return true;
  }

  async removeExclusionListWord(rawWord: string): Promise<void> {
    const normalizedWord = this.normalizeExclusionListWord(rawWord);
    this.settings = {
      ...this.settings,
      exclusionListWords: this.settings.exclusionListWords.filter((word) => word !== normalizedWord),
    };
    await this.persist();
  }

  async resetExclusionListWords(): Promise<void> {
    this.settings = {
      ...this.settings,
      exclusionListWords: this.sortExclusionListWords([...DEFAULT_SETTINGS.exclusionListWords]),
    };
    await this.persist();
  }

  private async persist(): Promise<void> {
    await this.plugin.saveData(this.settings);
    this.emitChange();
  }

  private emitChange(): void {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }

  private normalizeExclusionListWords(rawValue: unknown): string[] {
    if (!Array.isArray(rawValue)) {
      return [...DEFAULT_SETTINGS.exclusionListWords];
    }

    const seen = new Set<string>();
    for (const entry of rawValue) {
      if (typeof entry !== 'string') {
        continue;
      }
      const normalized = this.normalizeExclusionListWord(entry);
      if (normalized) {
        seen.add(normalized);
      }
    }

    return seen.size > 0
      ? this.sortExclusionListWords([...seen])
      : this.sortExclusionListWords([...DEFAULT_SETTINGS.exclusionListWords]);
  }

  private normalizeExclusionListWord(word: string): string {
    return word.trim().toLowerCase();
  }

  private sortExclusionListWords(words: string[]): string[] {
    return [...words].sort((a, b) => a.localeCompare(b));
  }

  private normalizeFilterSettings(rawValue: unknown): WordCloudFilterSettings {
    const raw = (rawValue && typeof rawValue === 'object') ? rawValue as Partial<WordCloudFilterSettings> : {};

    const scope = this.normalizeScope(raw.scope);
    const includeTags = normalizeTagList(raw.includeTags);
    const excludeTags = normalizeTagList(raw.excludeTags).filter((tag) => !includeTags.includes(tag));
    const tagMatchMode: TagMatchMode = raw.tagMatchMode === 'all' ? 'all' : 'any';
    const frontmatterRules = normalizeFrontmatterRules(raw.frontmatterRules);
    const minCount = this.clampNumber(raw.frequency?.minCount, 1, 9999, DEFAULT_SETTINGS.filters.frequency.minCount);
    const maxCount = this.clampNumber(raw.frequency?.maxCount, 1, 9999, DEFAULT_SETTINGS.filters.frequency.maxCount);

    return {
      scope,
      includeTags,
      excludeTags,
      tagMatchMode,
      frontmatterRules,
      frequency: {
        minCount: Math.min(minCount, maxCount),
        maxCount: Math.max(minCount, maxCount),
      },
    };
  }

  private normalizeScope(rawValue: unknown): SourceScope {
    const raw = (rawValue && typeof rawValue === 'object') ? rawValue as Partial<SourceScope> : {};
    const mode = raw.mode === 'active-file' || raw.mode === 'folder' || raw.mode === 'vault'
      ? raw.mode
      : DEFAULT_SETTINGS.filters.scope.mode;

    const activeFilePath = typeof raw.activeFilePath === 'string' ? raw.activeFilePath.trim() : '';
    const folderPaths = Array.isArray(raw.folderPaths)
      ? [...new Set(raw.folderPaths
        .filter((path): path is string => typeof path === 'string')
        .map((path) => path.trim())
        .filter(Boolean))]
      : [];

    return {
      mode,
      activeFilePath,
      folderPaths,
    };
  }

  private normalizeRenderSettings(rawValue: unknown): RenderSettings {
    const raw = (rawValue && typeof rawValue === 'object') ? rawValue as Partial<RenderSettings> : {};

    const rotationPreset = raw.rotationPreset === 'horizontal'
      || raw.rotationPreset === 'mostly-horizontal'
      || raw.rotationPreset === 'mixed'
      || raw.rotationPreset === 'vertical'
      ? raw.rotationPreset
      : DEFAULT_SETTINGS.render.rotationPreset;

    const spiral = raw.spiral === 'archimedean' || raw.spiral === 'rectangular'
      ? raw.spiral
      : DEFAULT_SETTINGS.render.spiral;

    const wordPadding = this.clampNumber(raw.wordPadding, 0, 12, DEFAULT_SETTINGS.render.wordPadding);
    const minFontSize = this.clampNumber(raw.minFontSize, 8, 64, DEFAULT_SETTINGS.render.minFontSize);
    const maxFontSize = this.clampNumber(raw.maxFontSize, 16, 140, DEFAULT_SETTINGS.render.maxFontSize);
    const safeMinFontSize = Math.min(minFontSize, maxFontSize);
    const safeMaxFontSize = Math.max(maxFontSize, safeMinFontSize);

    const fontFamily = typeof raw.fontFamily === 'string' && raw.fontFamily.trim().length > 0
      ? raw.fontFamily.trim()
      : DEFAULT_SETTINGS.render.fontFamily;

    const scalingMode = raw.scalingMode === 'linear'
      || raw.scalingMode === 'power'
      || raw.scalingMode === 'log'
      || raw.scalingMode === 'rank'
      ? raw.scalingMode
      : DEFAULT_SETTINGS.render.scalingMode;

    const emphasis = this.clampFloat(raw.emphasis, 0.5, 3, DEFAULT_SETTINGS.render.emphasis);

    const showCountInWordText = typeof raw.showCountInWordText === 'boolean'
      ? raw.showCountInWordText
      : DEFAULT_SETTINGS.render.showCountInWordText;

    const wordTextMetric = raw.wordTextMetric === 'count' || raw.wordTextMetric === 'frequency'
      ? raw.wordTextMetric
      : DEFAULT_SETTINGS.render.wordTextMetric;

    const showWordTextMetricToggle = typeof raw.showWordTextMetricToggle === 'boolean'
      ? raw.showWordTextMetricToggle
      : DEFAULT_SETTINGS.render.showWordTextMetricToggle;

    const countLabelMinCount = this.clampNumber(raw.countLabelMinCount, 1, 100, DEFAULT_SETTINGS.render.countLabelMinCount);

    const performanceMode = raw.performanceMode === 'full-speed'
      || raw.performanceMode === 'balanced'
      || raw.performanceMode === 'throttled'
      ? raw.performanceMode
      : DEFAULT_SETTINGS.render.performanceMode;

    const scanBatchSize = this.clampNumber(raw.scanBatchSize, 8, 64, DEFAULT_SETTINGS.render.scanBatchSize);
    const layoutTimeIntervalMs = this.clampNumber(raw.layoutTimeIntervalMs, 8, 40, DEFAULT_SETTINGS.render.layoutTimeIntervalMs);

    const deterministicLayout = typeof raw.deterministicLayout === 'boolean'
      ? raw.deterministicLayout
      : DEFAULT_SETTINGS.render.deterministicLayout;

    const randomSeed = this.clampNumber(raw.randomSeed, 1, 2147483647, DEFAULT_SETTINGS.render.randomSeed);
    const enableMouseInteractions = typeof raw.enableMouseInteractions === 'boolean'
      ? raw.enableMouseInteractions
      : DEFAULT_SETTINGS.render.enableMouseInteractions;
    const enableControls = typeof raw.enableControls === 'boolean'
      ? raw.enableControls
      : DEFAULT_SETTINGS.render.enableControls;
    const enableExporting = typeof raw.enableExporting === 'boolean'
      ? raw.enableExporting
      : DEFAULT_SETTINGS.render.enableExporting;

    return {
      rotationPreset,
      spiral,
      wordPadding,
      minFontSize: safeMinFontSize,
      maxFontSize: safeMaxFontSize,
      fontFamily,
      scalingMode,
      emphasis,
      showCountInWordText,
      wordTextMetric,
      showWordTextMetricToggle,
      countLabelMinCount,
      performanceMode,
      scanBatchSize,
      layoutTimeIntervalMs,
      deterministicLayout,
      randomSeed,
      enableMouseInteractions,
      enableControls,
      enableExporting,
    };
  }

  private clampNumber(value: unknown, min: number, max: number, fallback: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return fallback;
    }

    return Math.min(max, Math.max(min, Math.round(value)));
  }

  private clampFloat(value: unknown, min: number, max: number, fallback: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return fallback;
    }

    return Math.min(max, Math.max(min, value));
  }

}

function normalizeTagList(rawTags: unknown): string[] {
  if (!Array.isArray(rawTags)) {
    return [];
  }

  const tags = new Set<string>();
  for (const value of rawTags) {
    if (typeof value !== 'string') {
      continue;
    }

    const normalized = normalizeTag(value);
    if (normalized) {
      tags.add(normalized);
    }
  }

  return [...tags];
}

function normalizeFrontmatterRules(rawRules: unknown): FrontmatterRule[] {
  if (!Array.isArray(rawRules)) {
    return [];
  }

  const allowed = new Set(['equals', 'not-equals', 'contains', 'gt', 'gte', 'lt', 'lte', 'exists', 'not-exists']);
  const rules: FrontmatterRule[] = [];

  for (const rule of rawRules) {
    if (!rule || typeof rule !== 'object') {
      continue;
    }

    const candidate = rule as Partial<FrontmatterRule>;
    const key = typeof candidate.key === 'string' ? candidate.key.trim() : '';
    if (!key) {
      continue;
    }

    const operator = typeof candidate.operator === 'string' && allowed.has(candidate.operator)
      ? candidate.operator as FrontmatterRule['operator']
      : 'equals';
    const value = typeof candidate.value === 'string' ? candidate.value : '';

    rules.push({ key, operator, value });
  }

  return rules;
}

function cloneSettings(settings: WordCloudSettings): WordCloudSettings {
  return {
    exclusionListWords: [...settings.exclusionListWords],
    render: { ...settings.render },
    filters: {
      scope: {
        ...settings.filters.scope,
        folderPaths: [...(settings.filters.scope.folderPaths ?? [])],
      },
      includeTags: [...settings.filters.includeTags],
      excludeTags: [...settings.filters.excludeTags],
      tagMatchMode: settings.filters.tagMatchMode,
      frontmatterRules: settings.filters.frontmatterRules.map((rule) => ({ ...rule })),
      frequency: {
        ...settings.filters.frequency,
      },
    },
  };
}
