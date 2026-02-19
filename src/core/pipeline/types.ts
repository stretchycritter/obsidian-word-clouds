import type { FrequencyThresholds, RenderSettings, SourceSelectionRules } from '@/settings/types';
import type { PipelineDocument, WeightedWord } from '@/core';

export type PipelineInput = {
  documents: PipelineDocument[];
  stopWords: Set<string>;
  minWordLength: number;
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
