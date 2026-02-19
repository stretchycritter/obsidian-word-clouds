import type { TFile } from 'obsidian';
import type { WordCloudRenderOptions } from '@/core';
import type {
  FrequencyThresholds,
  NlpSettings,
  RenderSettings,
  SourceSelectionRules,
  TagMatchMode,
  WordCloudFilterSettings,
} from '@/settings/types';
import type { WeightedWord } from '@/core';

export type SearchOptions = {
  includeTags?: string[];
  excludeTags?: string[];
  tagMatchMode?: TagMatchMode;
  filePath?: string;
};

export type VaultCollectionOptions = {
  sourceRules?: SourceSelectionRules;
  frequency?: FrequencyThresholds;
  nlpSettings?: NlpSettings;
  excludeWords?: string[];
  renderSettingsOverride?: Partial<RenderSettings>;
};

export interface WordCloudServices {
  getAvailableTags(): string[];
  getAvailableFolders(): string[];
  getOpenMarkdownFiles(): TFile[];
  getActiveFile(): TFile | null;
  getFilterSettings(): WordCloudFilterSettings;
  updateFilterSettings(patch: Partial<WordCloudFilterSettings>): Promise<void>;
  collectVaultWords(
    options?: VaultCollectionOptions,
    onProgress?: (message: string, percent: number) => void,
  ): Promise<WeightedWord[]>;
  collectFileWords(
    file: TFile,
    onProgress?: (message: string, percent: number) => void,
    options?: {
      excludeWords?: string[];
      renderSettingsOverride?: Partial<RenderSettings>;
    },
  ): Promise<WeightedWord[]>;
  drawWordCloud(options: WordCloudRenderOptions): Promise<void>;
  openSearchForWord(word: string, options?: SearchOptions): Promise<void>;
  addExclusionListWord(rawWord: string): Promise<boolean>;
}
