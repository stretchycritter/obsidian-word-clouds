import type { App, TFile } from 'obsidian';
import type { WeightedWord } from '@/domain/word-cloud';
import type { FrequencyThresholds, RenderSettings, SourceSelectionRules } from '@/settings/types';
import { filterSourceFilesByMetadata, getAvailableTags, readPipelineDocuments } from '@/core/ingestion';
import { runTransformPipeline } from '@/core/pipeline';

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

    const performance = getPerformanceProfile(renderSettings.performanceMode);
    const reportProgress = createThrottledProgress(onProgress, performance.progressThrottleMs);
    const resolvedBatchSize = performance.readBatchSize ?? Math.max(8, Math.round(renderSettings.scanBatchSize));
    const readBatchSize = Math.max(1, Math.min(filesForScan.length || 1, resolvedBatchSize));

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

function getPerformanceProfile(mode: RenderSettings['performanceMode']): {
  progressThrottleMs: number;
  readBatchSize: number | null;
} {
  if (mode === 'full-speed') {
    return {
      progressThrottleMs: 1_000_000,
      readBatchSize: Number.MAX_SAFE_INTEGER,
    };
  }

  if (mode === 'throttled') {
    return {
      progressThrottleMs: 300,
      readBatchSize: 8,
    };
  }

  return {
    progressThrottleMs: 80,
    readBatchSize: null,
  };
}
