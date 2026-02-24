export type ProgressCallback = (message: string, percent: number) => void;

/**
 * Creates a throttled progress reporter that fires at most once per `minIntervalMs`.
 * The final call (percent === 100) is always reported regardless of timing.
 *
 * Shared utility — previously duplicated in wordcloud-service.ts and word-cloud-renderer.ts.
 */
export function createThrottledProgress(
  onProgress: ProgressCallback | undefined,
  minIntervalMs: number,
): ProgressCallback {
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
