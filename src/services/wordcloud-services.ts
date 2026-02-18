import type { App, TFile } from 'obsidian';
import { drawWordCloud } from '../ui/renderers/word-cloud-renderer';
import { openSearchForWord } from '../utils/apply-search';
import type {
  SearchOptions,
  VaultCollectionOptions,
  WordCloudRenderOptions,
  WordCloudServices,
} from './types';
import type { ObsidianService } from './obsidian-service';
import type { SettingsService } from '../settings/service';
import type { RenderSettings, WordCloudFilterSettings, WordCloudSettings } from '../settings/types';
import type { WordCloudService } from '../wordcloud/application/wordcloud-service';
import type { WeightedWord } from '../wordcloud/types';
import { mergeRenderSettings } from './render-settings';

export interface WordCloudSettingsControls {
  getSettingsSnapshot(): Readonly<WordCloudSettings>;
  updateRenderSettings(patch: Partial<RenderSettings>): Promise<void>;
  resetRenderSettings(): Promise<void>;
  removeExclusionListWord(rawWord: string): Promise<void>;
  resetExclusionListWords(): Promise<void>;
}

export class WordCloudAppService implements WordCloudServices, WordCloudSettingsControls {
  constructor(
    private readonly app: App,
    private readonly obsidian: ObsidianService,
    private readonly processor: WordCloudService,
    private readonly settingsService: SettingsService,
  ) {}

  getSettingsSnapshot(): Readonly<WordCloudSettings> {
    return this.settingsService.getSnapshot();
  }

  getAvailableTags(): string[] {
    return this.processor.getAvailableTags();
  }

  getAvailableFolders(): string[] {
    return this.obsidian.getAvailableFolders();
  }

  getOpenMarkdownFiles(): TFile[] {
    return this.obsidian.getOpenMarkdownFiles();
  }

  getActiveFile(): TFile | null {
    return this.obsidian.getActiveFile();
  }

  getFilterSettings(): WordCloudFilterSettings {
    return this.settingsService.getSnapshot().filters;
  }

  async updateFilterSettings(patch: Partial<WordCloudFilterSettings>): Promise<void> {
    await this.settingsService.updateFilters(patch);
  }

  async collectVaultWords(
    options: VaultCollectionOptions = {},
    onProgress?: (message: string, percent: number) => void,
  ): Promise<WeightedWord[]> {
    const settings = this.settingsService.getSnapshot();
    const renderSettings = mergeRenderSettings(settings.render, options.renderSettingsOverride);
    const sourceRules = options.sourceRules ?? {
      scope: settings.filters.scope,
      includeTags: settings.filters.includeTags,
      excludeTags: settings.filters.excludeTags,
      tagMatchMode: settings.filters.tagMatchMode,
      frontmatterRules: settings.filters.frontmatterRules,
    };
    const frequency = options.frequency ?? settings.filters.frequency;

    return this.processor.collectFromFiles(
      this.obsidian.getMarkdownFiles(),
      this.settingsService.getExclusionListSet(),
      renderSettings,
      onProgress,
      {
        sourceRules,
        frequency,
        excludeWords: options.excludeWords,
      },
    );
  }

  async collectFileWords(
    file: TFile,
    onProgress?: (message: string, percent: number) => void,
    options?: {
      excludeWords?: string[];
      renderSettingsOverride?: Partial<RenderSettings>;
    },
  ): Promise<WeightedWord[]> {
    const settings = this.settingsService.getSnapshot();
    const renderSettings = mergeRenderSettings(settings.render, options?.renderSettingsOverride);

    return this.processor.collectFromFiles([file], this.settingsService.getExclusionListSet(), renderSettings, onProgress, {
      excludeWords: options?.excludeWords,
    });
  }

  async drawWordCloud(options: WordCloudRenderOptions): Promise<void> {
    const settings = this.settingsService.getSnapshot();
    const renderSettings = mergeRenderSettings(settings.render, options.renderSettingsOverride);
    return drawWordCloud(options, renderSettings);
  }

  async openSearchForWord(word: string, options: SearchOptions = {}): Promise<void> {
    return openSearchForWord(this.app, word, options);
  }

  async addExclusionListWord(rawWord: string): Promise<boolean> {
    return this.settingsService.addExclusionListWord(rawWord);
  }

  async removeExclusionListWord(rawWord: string): Promise<void> {
    await this.settingsService.removeExclusionListWord(rawWord);
  }

  async resetExclusionListWords(): Promise<void> {
    await this.settingsService.resetExclusionListWords();
  }

  async updateRenderSettings(patch: Partial<RenderSettings>): Promise<void> {
    await this.settingsService.updateRenderSettings(patch);
  }

  async resetRenderSettings(): Promise<void> {
    await this.settingsService.resetRenderSettings();
  }
}
