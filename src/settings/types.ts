export type TagMatchMode = 'any' | 'all';
export type RotationPreset = 'horizontal' | 'mostly-horizontal' | 'mixed' | 'vertical';
export type SpiralType = 'archimedean' | 'rectangular';
export type ScalingMode = 'linear' | 'power' | 'log' | 'rank';
export type WordTextMetric = 'count' | 'frequency';
export type PerformanceMode = 'full-speed' | 'balanced' | 'throttled';
export type FontFamilyOption = {
  value: string;
  label: string;
};
export type SettingsPreviewWord = readonly [string, number];

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
  countLabelMinCount: number;
  performanceMode: PerformanceMode;
  scanBatchSize: number;
  layoutTimeIntervalMs: number;
  deterministicLayout: boolean;
  randomSeed: number;
  enableMouseInteractions: boolean;
  enableControls: boolean;
  enableExporting: boolean;
};

export type SourceScopeMode = 'vault' | 'active-file' | 'folder';

export type SourceScope = {
  mode: SourceScopeMode;
  activeFilePath?: string;
  folderPaths?: string[];
};

export type FrontmatterOperator = 'equals' | 'not-equals' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'exists' | 'not-exists';

export type FrontmatterRule = {
  key: string;
  operator: FrontmatterOperator;
  value?: string;
};

export type PathRules = {
  folderPrefixes?: string[];
  exactFolders?: string[];
  subfolderRoots?: string[];
  filenameEquals?: string[];
  filenameRegex?: string;
  extensions?: string[];
};

export type DateRangeRule = {
  before?: number;
  after?: number;
  between?: {
    start: number;
    end: number;
  };
};

export type LinkRules = {
  filePaths?: string[];
  folderPrefixes?: string[];
  minCount?: number;
  maxCount?: number;
  withTags?: string[];
  tagMatchMode?: TagMatchMode;
};

export type FrequencyThresholds = {
  minCount?: number;
  maxCount?: number;
};

export type SourceSelectionRules = {
  scope?: SourceScope;
  pathRules?: PathRules;
  includeTags?: string[];
  excludeTags?: string[];
  includeTagPrefixes?: string[];
  excludeTagPrefixes?: string[];
  tagPrefixMatchMode?: TagMatchMode;
  tagMatchMode?: TagMatchMode;
  frontmatterRules?: FrontmatterRule[];
  modifiedTime?: DateRangeRule;
  createdTime?: DateRangeRule;
  outgoingLinks?: LinkRules;
  incomingLinks?: LinkRules;
  queryText?: string;
};

export type WordCloudFilterSettings = {
  scope: SourceScope;
  includeTags: string[];
  excludeTags: string[];
  tagMatchMode: TagMatchMode;
  frontmatterRules: FrontmatterRule[];
  minWordLength: number;
  frequency: Required<FrequencyThresholds>;
};

export interface WordCloudSettings {
  exclusionListWords: string[];
  render: RenderSettings;
  filters: WordCloudFilterSettings;
}
