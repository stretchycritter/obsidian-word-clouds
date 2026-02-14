import type { TFile } from 'obsidian';

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
  onRefresh: () => void | Promise<void>;
  onProgress?: (message: string, percent: number) => void;
  exportBaseName?: string;
  enableExport?: boolean;
  enableOverlayControls?: boolean;
  enableViewportInteraction?: boolean;
  showRefreshControl?: boolean;
  showZoomControls?: boolean;
};

export type SearchOptions = {
  tags?: string[];
  tagMatchMode?: TagMatchMode;
  filePath?: string;
};

export interface WordCloudServices {
  getAvailableTags(): string[];
  getOpenMarkdownFiles(): TFile[];
  getActiveFile(): TFile | null;
  collectVaultWords(
    tagFilters: string[],
    tagMatchMode: TagMatchMode,
    onProgress?: (message: string, percent: number) => void,
  ): Promise<WeightedWord[]>;
  collectFileWords(file: TFile, onProgress?: (message: string, percent: number) => void): Promise<WeightedWord[]>;
  drawWordCloud(options: WordCloudRenderOptions): Promise<void>;
  openSearchForWord(word: string, options?: SearchOptions): Promise<void>;
}
