import type { App, TFile } from 'obsidian';
import type { RenderSettings, WeightedWord } from '../../types';
import { readPipelineDocuments } from '../ingestion/obsidian-source';
import { filterSourceFilesByMetadata } from '../ingestion/metadata-file-filter';
import { getAvailableTags } from '../ingestion/tag-catalog';
import { runTransformPipeline } from '../pipeline/run-transform-pipeline';
import type { FrequencyThresholds, SourceSelectionRules } from '../pipeline/types';

export class WordCloudService {
  private readonly app: App;

  constructor(app: App) {
    this.app = app;
  }

  getAvailableTags(): string[] {
    return getAvailableTags(this.app);
  }

  async collectFromFiles(
    files: TFile[],
    stopWords: Set<string>,
    renderSettings: RenderSettings,
    onProgress?: (message: string, percent: number) => void,
    options?: {
      sourceRules?: SourceSelectionRules;
      frequency?: FrequencyThresholds;
      excludeWords?: string[];
    },
  ): Promise<WeightedWord[]> {
    const filesForScan = filterSourceFilesByMetadata(this.app, files, options?.sourceRules);

    const performance = getPerformanceProfile(renderSettings.progressDetail);
    const reportProgress = createThrottledProgress(onProgress, performance.progressThrottleMs);
    const readBatchSize = performance.fullParallelRead
      ? Math.max(1, filesForScan.length)
      : Math.max(8, Math.round(renderSettings.scanBatchSize));

    const documents = await readPipelineDocuments(
      this.app,
      filesForScan,
      readBatchSize,
      (message, percent) => {
        reportProgress(message, percent);
      },
    );

    reportProgress('Tokenizing and aggregating...', 85);

    const combinedStopWords = new Set(stopWords);
    for (const word of options?.excludeWords ?? []) {
      const normalized = word.trim().toLowerCase();
      if (normalized) {
        combinedStopWords.add(normalized);
      }
    }

    const model = runTransformPipeline({
      documents,
      stopWords: combinedStopWords,
      renderSettings,
      sourceRules: options?.sourceRules,
      frequency: options?.frequency,
    });

    reportProgress('Preparing layout...', 95);

    return model.wordCloudWords;
  }
}

function createThrottledProgress(
  onProgress: ((message: string, percent: number) => void) | undefined,
  minIntervalMs: number,
): (message: string, percent: number) => void {
  if (!onProgress) {
    return () => undefined;
  }

  let lastReportedAt = 0;
  let lastPercent = -1;

  return (message: string, percent: number) => {
    const now = Date.now();
    if (percent !== 100 && percent === lastPercent && now - lastReportedAt < minIntervalMs) {
      return;
    }
    if (percent !== 100 && now - lastReportedAt < minIntervalMs) {
      return;
    }

    lastReportedAt = now;
    lastPercent = percent;
    onProgress(message, percent);
  };
}

function getPerformanceProfile(detail: RenderSettings['progressDetail']): {
  progressThrottleMs: number;
  fullParallelRead: boolean;
} {
  if (detail === 'unhinged') {
    return {
      progressThrottleMs: 1_000_000,
      fullParallelRead: true,
    };
  }

  if (detail === 'detailed') {
    return {
      progressThrottleMs: 25,
      fullParallelRead: false,
    };
  }

  if (detail === 'minimal') {
    return {
      progressThrottleMs: 220,
      fullParallelRead: false,
    };
  }

  return {
    progressThrottleMs: 80,
    fullParallelRead: false,
  };
}
