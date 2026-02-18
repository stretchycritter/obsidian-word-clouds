import type { TFile } from 'obsidian';
import type {
  FrequencyThresholds,
  RenderSettings,
  SourceSelectionRules,
  TagMatchMode,
  WordCloudFilterSettings,
} from '../settings/types';
import type { WeightedWord } from '../wordcloud/types';

export type WordCloudRenderOptions = {
  containerEl: HTMLDivElement;
  words: WeightedWord[];
  ariaLabel: string;
  onWordClick: (word: string) => void;
  onExcludeInCloud?: (word: string) => void | Promise<void>;
  onExcludeInVault?: (word: string) => void | Promise<void>;
  onRefresh: () => void | Promise<void>;
  onEdit?: () => void | Promise<void>;
  onProgress?: (message: string, percent: number) => void;
  exportBaseName?: string;
  enableExport?: boolean;
  enableOverlayControls?: boolean;
  enableViewportInteraction?: boolean;
  showRefreshControl?: boolean;
  showZoomControls?: boolean;
  showEditControl?: boolean;
  renderSettingsOverride?: Partial<RenderSettings>;
};

export type SearchOptions = {
  includeTags?: string[];
  excludeTags?: string[];
  tagMatchMode?: TagMatchMode;
  filePath?: string;
};

export type VaultCollectionOptions = {
  sourceRules?: SourceSelectionRules;
  frequency?: FrequencyThresholds;
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
