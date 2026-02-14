import type { App, TFile } from 'obsidian';
import type { RenderSettings, TagMatchMode, WeightedWord } from '../types';
import { collectWordFrequenciesFromFiles } from './text-processing';
import { filterFilesByTags, getAvailableTags } from './tag-filter';

export class WordCloudProcessor {
  private readonly app: App;

  constructor(app: App) {
    this.app = app;
  }

  getAvailableTags(): string[] {
    return getAvailableTags(this.app);
  }

  filterFilesByTags(files: TFile[], tagFilters: string[], tagMatchMode: TagMatchMode): TFile[] {
    return filterFilesByTags(this.app, files, tagFilters, tagMatchMode);
  }

  async collectFromFiles(
    files: TFile[],
    stopWords: Set<string>,
    renderSettings: RenderSettings,
    onProgress?: (message: string, percent: number) => void,
  ): Promise<WeightedWord[]> {
    return collectWordFrequenciesFromFiles(this.app, files, stopWords, renderSettings, onProgress);
  }
}
