export type TagMatchMode = 'any' | 'all';
export type RotationPreset = 'horizontal' | 'mostly-horizontal' | 'mixed' | 'vertical';
export type SpiralType = 'archimedean' | 'rectangular';
export type ScalingMode = 'linear' | 'power' | 'log' | 'rank';
export type WordTextMetric = 'count' | 'frequency';
export type PerformanceMode = 'full-speed' | 'balanced' | 'throttled';

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
  frequency: Required<FrequencyThresholds>;
};

export interface WordCloudSettings {
  exclusionListWords: string[];
  render: RenderSettings;
  filters: WordCloudFilterSettings;
}

const DEFAULT_STOP_WORDS: string[] = [
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'are', 'was', 'were', 'have', 'has', 'had',
  'you', 'your', 'they', 'them', 'their', 'its', 'our', 'ours', 'his', 'her', 'she', 'him', 'not',
  'but', 'can', 'will', 'all', 'any', 'one', 'two', 'too', 'use', 'using', 'into', 'out', 'about',
  'there', 'then', 'than', 'when', 'what', 'where', 'which', 'who', 'whom', 'how', 'why', 'also',
  'just', 'like', 'some', 'more', 'most', 'much', 'many', 'very', 'each', 'other', 'such', 'only',
  'note', 'notes', 'todo', 'done', 'null', 'true', 'false', 'http', 'https', 'www', 'com',
];

export const DEFAULT_SETTINGS: WordCloudSettings = {
  exclusionListWords: [...DEFAULT_STOP_WORDS],
  render: {
    rotationPreset: 'mostly-horizontal',
    spiral: 'archimedean',
    wordPadding: 2,
    minFontSize: 14,
    maxFontSize: 72,
    fontFamily: 'sans-serif',
    scalingMode: 'power',
    emphasis: 1,
    showCountInWordText: false,
    wordTextMetric: 'count',
    showWordTextMetricToggle: false,
    countLabelMinCount: 1,
    performanceMode: 'balanced',
    scanBatchSize: 24,
    layoutTimeIntervalMs: 16,
    deterministicLayout: false,
    randomSeed: 42,
    enableMouseInteractions: true,
    enableControls: true,
    enableExporting: true,
  },
  filters: {
    scope: {
      mode: 'vault',
      activeFilePath: '',
      folderPaths: [],
    },
    includeTags: [],
    excludeTags: [],
    tagMatchMode: 'any',
    frontmatterRules: [],
    frequency: {
      minCount: 1,
      maxCount: 9999,
    },
  },
};
