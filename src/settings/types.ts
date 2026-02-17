import { DEFAULT_STOP_WORDS } from '../constants';
import type { RenderSettings, WordCloudFilterSettings } from '../types';

export interface WordCloudSettings {
  exclusionListWords: string[];
  render: RenderSettings;
  filters: WordCloudFilterSettings;
}

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
