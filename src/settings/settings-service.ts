import type { Plugin } from 'obsidian';
import type {
  RenderSettings,
  FontFamilyOption,
  WordCloudSettings,
  WordCloudFilterSettings,
} from '@/settings/types';
import { DEFAULT_SETTINGS, SETTINGS_PREVIEW_TEMPLATE, SUPPORTED_FONT_FAMILIES } from '@/settings/constants';
import type { WeightedWord } from '@/core';
import { mapCountsToWeightedWords } from '@/shared/word-scaling';
import {
  cloneSettings,
  normalizeExclusionListWord,
  normalizeExclusionListWords,
  normalizeFilterSettings,
  normalizeRenderSettings,
  sortExclusionListWords,
} from '@/settings/settings-normalizers';

export type SettingsChangeListener = (settings: Readonly<WordCloudSettings>) => void;

export class SettingsService {
  private settings: WordCloudSettings = cloneSettings(DEFAULT_SETTINGS);
  private readonly listeners = new Set<SettingsChangeListener>();
  private updateQueue: Promise<void> = Promise.resolve();

  constructor(private readonly plugin: Plugin) {}

  async load(): Promise<void> {
    const loaded = await this.plugin.loadData();
    const raw = (loaded && typeof loaded === 'object') ? loaded as { exclusionListWords?: unknown; render?: unknown; filters?: unknown } : {};
    this.settings = {
      exclusionListWords: normalizeExclusionListWords(raw.exclusionListWords),
      render: normalizeRenderSettings(raw.render),
      filters: normalizeFilterSettings(raw.filters),
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
    return new Set(this.settings.exclusionListWords.map((word) => normalizeExclusionListWord(word)).filter(Boolean));
  }

  getSupportedFontFamilyOptions(): ReadonlyArray<FontFamilyOption> {
    return SUPPORTED_FONT_FAMILIES;
  }

  getSelectedSupportedFontFamily(rawFontFamily: string): string {
    const selectedFontFamily = rawFontFamily.trim();
    const supportedValues = new Set(SUPPORTED_FONT_FAMILIES.map((option) => option.value));
    return supportedValues.has(selectedFontFamily)
      ? selectedFontFamily
      : DEFAULT_SETTINGS.render.fontFamily;
  }

  getSettingsPreviewWords(): WeightedWord[] {
    return mapCountsToWeightedWords(
      SETTINGS_PREVIEW_TEMPLATE.map(([word, count]) => [word, count] as [string, number]),
      this.settings.render,
    );
  }

  async updateMinimumFontSize(minFontSize: number): Promise<RenderSettings> {
    return this.enqueueUpdate(async () => {
      const current = this.settings.render;
      const nextMin = Math.min(minFontSize, current.maxFontSize);
      const nextMax = Math.max(current.maxFontSize, nextMin);
      const nextSettings: WordCloudSettings = {
        ...this.settings,
        render: normalizeRenderSettings({
          ...this.settings.render,
          minFontSize: nextMin,
          maxFontSize: nextMax,
        }),
      };
      await this.persist(nextSettings);
      return { ...this.settings.render };
    });
  }

  async updateMaximumFontSize(maxFontSize: number): Promise<RenderSettings> {
    return this.enqueueUpdate(async () => {
      const current = this.settings.render;
      const nextMax = Math.max(maxFontSize, current.minFontSize);
      const nextMin = Math.min(current.minFontSize, nextMax);
      const nextSettings: WordCloudSettings = {
        ...this.settings,
        render: normalizeRenderSettings({
          ...this.settings.render,
          minFontSize: nextMin,
          maxFontSize: nextMax,
        }),
      };
      await this.persist(nextSettings);
      return { ...this.settings.render };
    });
  }

  async updateFilters(patch: Partial<WordCloudFilterSettings>): Promise<void> {
    await this.enqueueUpdate(async () => {
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

      const nextSettings: WordCloudSettings = {
        ...this.settings,
        filters: normalizeFilterSettings(merged),
      };
      await this.persist(nextSettings);
    });
  }

  async updateRenderSettings(patch: Partial<RenderSettings>): Promise<void> {
    await this.enqueueUpdate(async () => {
      const merged = {
        ...this.settings.render,
        ...patch,
      };

      const nextSettings: WordCloudSettings = {
        ...this.settings,
        render: normalizeRenderSettings(merged),
      };
      await this.persist(nextSettings);
    });
  }

  async resetRenderSettings(): Promise<void> {
    await this.enqueueUpdate(async () => {
      const nextSettings: WordCloudSettings = {
        ...this.settings,
        render: { ...DEFAULT_SETTINGS.render },
      };
      await this.persist(nextSettings);
    });
  }

  async addExclusionListWord(rawWord: string): Promise<boolean> {
    return this.enqueueUpdate(async () => {
      const normalizedWord = normalizeExclusionListWord(rawWord);
      if (!normalizedWord || this.settings.exclusionListWords.includes(normalizedWord)) {
        return false;
      }

      const nextSettings: WordCloudSettings = {
        ...this.settings,
        exclusionListWords: sortExclusionListWords([...this.settings.exclusionListWords, normalizedWord]),
      };
      await this.persist(nextSettings);
      return true;
    });
  }

  async removeExclusionListWord(rawWord: string): Promise<void> {
    await this.enqueueUpdate(async () => {
      const normalizedWord = normalizeExclusionListWord(rawWord);
      const nextSettings: WordCloudSettings = {
        ...this.settings,
        exclusionListWords: this.settings.exclusionListWords.filter((word) => word !== normalizedWord),
      };
      await this.persist(nextSettings);
    });
  }

  async resetExclusionListWords(): Promise<void> {
    await this.enqueueUpdate(async () => {
      const nextSettings: WordCloudSettings = {
        ...this.settings,
        exclusionListWords: sortExclusionListWords([...DEFAULT_SETTINGS.exclusionListWords]),
      };
      await this.persist(nextSettings);
    });
  }

  async resetAllSettings(): Promise<void> {
    await this.enqueueUpdate(async () => {
      const nextSettings: WordCloudSettings = {
        ...cloneSettings(DEFAULT_SETTINGS),
        exclusionListWords: sortExclusionListWords([...DEFAULT_SETTINGS.exclusionListWords]),
      };
      await this.persist(nextSettings);
    });
  }

  private async persist(nextSettings: WordCloudSettings): Promise<void> {
    await this.plugin.saveData(nextSettings);
    this.settings = nextSettings;
    this.emitChange();
  }

  private emitChange(): void {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      try {
        listener(snapshot);
      } catch (error) {
        console.error('SettingsService listener failed', error);
      }
    }
  }

  private enqueueUpdate<T>(operation: () => Promise<T>): Promise<T> {
    const queued = this.updateQueue.then(operation);
    this.updateQueue = queued.then(
      () => undefined,
      () => undefined,
    );
    return queued;
  }
}
