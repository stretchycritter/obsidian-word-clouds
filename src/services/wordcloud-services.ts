import type { App, TFile } from 'obsidian';
import { drawWordCloud } from '../renderers/word-cloud-renderer';
import { openSearchForWord } from '../utils/apply-search';
import type {
  RenderSettings,
  SearchOptions,
  VaultCollectionOptions,
  WordCloudFilterSettings,
  WordCloudRenderOptions,
  WordCloudServices,
  WeightedWord,
} from '../types';
import type { ObsidianAdapter } from '../integration/obsidian-adapter';
import type { SettingsService } from '../settings/service';
import type { WordCloudSettings } from '../settings/types';
import type { WordCloudService } from '../wordcloud/application/wordcloud-service';

export interface WordCloudSettingsControls {
  getSettingsSnapshot(): Readonly<WordCloudSettings>;
  updateRenderSettings(patch: Partial<RenderSettings>): Promise<void>;
  resetRenderSettings(): Promise<void>;
  removeBlacklistWord(rawWord: string): Promise<void>;
  resetBlacklistWords(): Promise<void>;
}

export class WordCloudAppService implements WordCloudServices, WordCloudSettingsControls {
  constructor(
    private readonly app: App,
    private readonly adapter: ObsidianAdapter,
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
    return this.adapter.getAvailableFolders();
  }

  getOpenMarkdownFiles(): TFile[] {
    return this.adapter.getOpenMarkdownFiles();
  }

  getActiveFile(): TFile | null {
    return this.adapter.getActiveFile();
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
    const sourceRules = options.sourceRules ?? {
      scope: settings.filters.scope,
      includeTags: settings.filters.includeTags,
      excludeTags: settings.filters.excludeTags,
      tagMatchMode: settings.filters.tagMatchMode,
      frontmatterRules: settings.filters.frontmatterRules,
    };
    const frequency = options.frequency ?? settings.filters.frequency;

    return this.processor.collectFromFiles(
      this.adapter.getMarkdownFiles(),
      this.settingsService.getBlacklistSet(),
      settings.render,
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
    options?: { excludeWords?: string[] },
  ): Promise<WeightedWord[]> {
    const settings = this.settingsService.getSnapshot();

    return this.processor.collectFromFiles([file], this.settingsService.getBlacklistSet(), settings.render, onProgress, {
      excludeWords: options?.excludeWords,
    });
  }

  async drawWordCloud(options: WordCloudRenderOptions): Promise<void> {
    const settings = this.settingsService.getSnapshot();
    return drawWordCloud(options, settings.render);
  }

  async openSearchForWord(word: string, options: SearchOptions = {}): Promise<void> {
    return openSearchForWord(this.app, word, options);
  }

  async addBlacklistWord(rawWord: string): Promise<boolean> {
    return this.settingsService.addBlacklistWord(rawWord);
  }

  async removeBlacklistWord(rawWord: string): Promise<void> {
    await this.settingsService.removeBlacklistWord(rawWord);
  }

  async resetBlacklistWords(): Promise<void> {
    await this.settingsService.resetBlacklistWords();
  }

  async updateRenderSettings(patch: Partial<RenderSettings>): Promise<void> {
    await this.settingsService.updateRenderSettings(patch);
  }

  async resetRenderSettings(): Promise<void> {
    await this.settingsService.resetRenderSettings();
  }
}
