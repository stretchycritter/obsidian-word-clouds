import type { FrequencyThresholds, RenderSettings, SourceSelectionRules } from '@/settings/types';
import type { WeightedWord } from '@/core';
import type { PipelineDocument } from '@/core/types';

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
