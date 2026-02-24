import type { App, TFile } from 'obsidian';
import type { WordCloudCollectionResult } from '@/core/types';
import type { FrequencyThresholds, NlpSettings, RenderSettings, SourceSelectionRules } from '@/settings/types';
import { DEFAULT_SETTINGS } from '@/settings/constants';
import { filterSourceFilesByMetadata, getAvailableTags, readPipelineDocuments } from '@/core/ingestion';
import { runTransformPipeline } from '@/core/pipeline';
import { createThrottledProgress } from '@/utils/throttled-progress';

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
      minWordLength?: number;
      excludeWords?: string[];
      nlpSettings?: NlpSettings;
    },
  ): Promise<WordCloudCollectionResult> {
    const startedAt = Date.now();
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
      minWordLength: options?.minWordLength ?? 3,
      renderSettings,
      sourceRules: options?.sourceRules,
      frequency: options?.frequency,
      nlpSettings: options?.nlpSettings ?? DEFAULT_SETTINGS.filters.nlp,
    });

    reportProgress('Preparing layout...', 95);

    return {
      words: model.wordCloudWords,
      metrics: {
        collectionMs: Date.now() - startedAt,
      },
    };
  }
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
