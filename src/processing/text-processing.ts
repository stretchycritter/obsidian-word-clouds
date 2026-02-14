import type { App, TFile } from 'obsidian';
import { FRONTMATTER_PATTERN, MAX_WORDS, MIN_WORD_LENGTH } from '../constants';
import type { RenderSettings, WeightedWord } from '../types';
import { mapCountsToWeightedWords } from './scaling';

export async function collectWordFrequenciesFromFiles(
  app: App,
  files: TFile[],
  stopWords: Set<string>,
  renderSettings: RenderSettings,
  onProgress?: (message: string, percent: number) => void,
): Promise<WeightedWord[]> {
  const counts = new Map<string, number>();
  const totalFiles = Math.max(1, files.length);
  const performance = getPerformanceProfile(renderSettings.progressDetail);
  const reportProgress = createThrottledProgress(onProgress, performance.progressThrottleMs);
  const readBatchSize = performance.fullParallelRead
    ? Math.max(1, files.length)
    : Math.max(8, Math.round(renderSettings.scanBatchSize));

  for (let batchStart = 0; batchStart < files.length; batchStart += readBatchSize) {
    const batch = files.slice(batchStart, batchStart + readBatchSize);
    const contents = await Promise.all(batch.map((file) => app.vault.cachedRead(file)));

    for (let batchIndex = 0; batchIndex < contents.length; batchIndex += 1) {
      const fileIndex = batchStart + batchIndex;
      const content = contents[batchIndex];

      reportProgress(`Scanning ${fileIndex + 1}/${files.length} files...`, Math.round((fileIndex / totalFiles) * 75));

      const contentWithoutFrontmatter = content.replace(FRONTMATTER_PATTERN, '');
      const normalizedText = contentWithoutFrontmatter.toLowerCase();
      const matches = normalizedText.match(/[a-z0-9][a-z0-9'-]*/g);
      if (!matches) {
        continue;
      }

      for (let tokenIndex = 0; tokenIndex < matches.length; tokenIndex += 1) {
        const rawWord = matches[tokenIndex];
        const word = rawWord.trim();
        if (word.length < MIN_WORD_LENGTH || stopWords.has(word)) {
          continue;
        }

        counts.set(word, (counts.get(word) ?? 0) + 1);

        if (performance.enableYielding && tokenIndex > 0 && tokenIndex % performance.tokenYieldInterval === 0) {
          await yieldToUi();
        }
      }
    }

    if (performance.enableYielding) {
      await yieldToUi();
    }
  }

  reportProgress('Applying size scaling...', 85);

  const sortedWords = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_WORDS);

  const weightedWords = mapCountsToWeightedWords(sortedWords, renderSettings);

  reportProgress('Preparing layout...', 95);

  return weightedWords;
}

function yieldToUi(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
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
  tokenYieldInterval: number;
  enableYielding: boolean;
  fullParallelRead: boolean;
} {
  if (detail === 'unhinged') {
    return {
      progressThrottleMs: 1_000_000,
      tokenYieldInterval: Number.MAX_SAFE_INTEGER,
      enableYielding: false,
      fullParallelRead: true,
    };
  }

  if (detail === 'detailed') {
    return {
      progressThrottleMs: 25,
      tokenYieldInterval: 8000,
      enableYielding: true,
      fullParallelRead: false,
    };
  }

  if (detail === 'minimal') {
    return {
      progressThrottleMs: 220,
      tokenYieldInterval: 50000,
      enableYielding: true,
      fullParallelRead: false,
    };
  }

  return {
    progressThrottleMs: 80,
    tokenYieldInterval: 20000,
    enableYielding: true,
    fullParallelRead: false,
  };
}
