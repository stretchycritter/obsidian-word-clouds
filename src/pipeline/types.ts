import type { RenderSettings, TagMatchMode, WeightedWord } from '../types';

export type PipelineDocument = {
  id: string;
  path: string;
  basename: string;
  rawText: string;
  tags: string[];
  frontmatter: Record<string, unknown>;
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

export type FrequencyThresholds = {
  minCount?: number;
  maxCount?: number;
};

export type SourceSelectionRules = {
  scope?: SourceScope;
  includeTags?: string[];
  excludeTags?: string[];
  tagMatchMode?: TagMatchMode;
  frontmatterRules?: FrontmatterRule[];
  queryText?: string;
};

export type PipelineInput = {
  documents: PipelineDocument[];
  stopWords: Set<string>;
  renderSettings: RenderSettings;
  sourceRules?: SourceSelectionRules;
  frequency?: FrequencyThresholds;
};

export type NormalizedDocument = {
  id: string;
  path: string;
  basename: string;
  tags: string[];
  text: string;
};

export type Token = {
  value: string;
  documentId: string;
};

export type AggregateResult = {
  entries: Array<[string, number]>;
  totalTokens: number;
  distinctTokens: number;
};

export type DistributionBucket = {
  label: string;
  min: number;
  max: number;
  value: number;
};

export type RenderModel = {
  wordCloudWords: WeightedWord[];
  distributionSeries: DistributionBucket[];
  totalTokens: number;
  distinctTokens: number;
};

export interface TokenizerStrategy {
  tokenize(text: string): string[];
}

export interface FilterStrategy {
  includeToken(token: string, stopWords: Set<string>): boolean;
}

export interface AggregatorStrategy {
  aggregate(tokens: Token[]): AggregateResult;
}

export interface ScalingStrategy {
  scale(entries: Array<[string, number]>, renderSettings: RenderSettings): WeightedWord[];
}

export interface RenderModelStrategy {
  buildModel(words: WeightedWord[], aggregate: AggregateResult): RenderModel;
}

export type PipelineStrategies = {
  tokenizer: TokenizerStrategy;
  filter: FilterStrategy;
  aggregator: AggregatorStrategy;
  scaling: ScalingStrategy;
  renderModel: RenderModelStrategy;
};
