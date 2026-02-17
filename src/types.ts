import type { TFile } from 'obsidian';
import type { FrequencyThresholds, FrontmatterRule, SourceSelectionRules, SourceScope } from './pipeline/types';

export type TagMatchMode = 'any' | 'all';

export type WeightedWord = {
  text: string;
  count: number;
  size: number;
};

export type RotationPreset = 'horizontal' | 'mostly-horizontal' | 'mixed' | 'vertical';
export type SpiralType = 'archimedean' | 'rectangular';
export type ScalingMode = 'linear' | 'power' | 'log' | 'rank';
export type CountLabelFormat = 'paren' | 'dot' | 'colon';
export type WordTextMetric = 'count' | 'frequency';
export type ProgressDetail = 'minimal' | 'balanced' | 'detailed' | 'unhinged';

export type RenderSettings = {
  rotationPreset: RotationPreset;
  spiral: SpiralType;
  wordPadding: number;
  minFontSize: number;
  maxFontSize: number;
  fontFamily: string;
  scalingMode: ScalingMode;
  emphasis: number;
  showCountInWordText: boolean;
  wordTextMetric: WordTextMetric;
  showWordTextMetricToggle: boolean;
  countLabelFormat: CountLabelFormat;
  countLabelMinCount: number;
  progressDetail: ProgressDetail;
  scanBatchSize: number;
  layoutTimeIntervalMs: number;
  deterministicLayout: boolean;
  randomSeed: number;
};

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
};

export type WordCloudFilterSettings = {
  scope: SourceScope;
  includeTags: string[];
  excludeTags: string[];
  tagMatchMode: TagMatchMode;
  frontmatterRules: FrontmatterRule[];
  frequency: Required<FrequencyThresholds>;
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
    options?: { excludeWords?: string[] },
  ): Promise<WeightedWord[]>;
  drawWordCloud(options: WordCloudRenderOptions): Promise<void>;
  openSearchForWord(word: string, options?: SearchOptions): Promise<void>;
  addBlacklistWord(rawWord: string): Promise<boolean>;
}
