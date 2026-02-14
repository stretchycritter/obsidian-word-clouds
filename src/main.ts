import { MarkdownView, Plugin, TFile } from 'obsidian';
import { VIEW_TYPE_NOTE_WORD_CLOUD, VIEW_TYPE_VAULT_WORD_CLOUD } from './constants';
import { registerEmbeddedWordCloudProcessor } from './block-renderers/wordcloud-block-renderer';
import { openSearchForWord } from './actions/apply-search';
import { WordCloudProcessor } from './processing/processor';
import { DEFAULT_SETTINGS, VaultWordCloudSettingTab, type WordCloudSettings } from './settings';
import type { RenderSettings, SearchOptions, TagMatchMode, WordCloudRenderOptions, WordCloudServices, WeightedWord } from './types';
import { drawWordCloud } from './rendering/word-cloud-renderer';
import { NoteWordCloudView } from './views/note-word-cloud-view';
import { VaultWordCloudView } from './views/vault-word-cloud-view';

export default class VaultWordCloudPlugin extends Plugin implements WordCloudServices {
  settings: WordCloudSettings = { ...DEFAULT_SETTINGS };
  private processor!: WordCloudProcessor;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.processor = new WordCloudProcessor(this.app);

    this.registerView(VIEW_TYPE_VAULT_WORD_CLOUD, (leaf) => new VaultWordCloudView(leaf, this));
    this.registerView(VIEW_TYPE_NOTE_WORD_CLOUD, (leaf) => new NoteWordCloudView(leaf, this));
    registerEmbeddedWordCloudProcessor(this, this);
    this.addSettingTab(new VaultWordCloudSettingTab(this));

    this.addRibbonIcon('cloud', 'Open word clouds', () => {
      void this.activateVaultWordCloudView();
    });

    this.addCommand({
      id: 'open-vault-word-cloud-view',
      name: 'Open vault word cloud',
      callback: () => {
        void this.activateVaultWordCloudView();
      },
    });

    this.addCommand({
      id: 'open-note-word-cloud-sidebar',
      name: 'Open current note word cloud',
      callback: () => {
        void this.activateNoteWordCloudView();
      },
    });
  }

  onunload(): void {
    // Obsidian automatically detaches views registered by this plugin.
  }

  async activateVaultWordCloudView(): Promise<void> {
    const { workspace } = this.app;
    const existingLeaf = workspace.getLeavesOfType(VIEW_TYPE_VAULT_WORD_CLOUD)[0];

    const leaf = existingLeaf ?? workspace.getLeaf(true);
    await leaf.setViewState({
      type: VIEW_TYPE_VAULT_WORD_CLOUD,
      active: true,
    });

    workspace.revealLeaf(leaf);
  }

  async activateNoteWordCloudView(): Promise<void> {
    const { workspace } = this.app;
    const existingLeaf = workspace.getLeavesOfType(VIEW_TYPE_NOTE_WORD_CLOUD)[0];

    const leaf = existingLeaf ?? workspace.getRightLeaf(false);
    if (!leaf) {
      return;
    }

    await leaf.setViewState({
      type: VIEW_TYPE_NOTE_WORD_CLOUD,
      active: true,
    });

    workspace.revealLeaf(leaf);
  }

  getAvailableTags(): string[] {
    return this.processor.getAvailableTags();
  }

  getOpenMarkdownFiles(): TFile[] {
    const files = new Map<string, TFile>();

    for (const leaf of this.app.workspace.getLeavesOfType('markdown')) {
      const view = leaf.view;
      if (view instanceof MarkdownView && view.file) {
        files.set(view.file.path, view.file);
      }
    }

    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
      files.set(activeFile.path, activeFile);
    }

    return [...files.values()].sort((a, b) => a.path.localeCompare(b.path));
  }

  getActiveFile(): TFile | null {
    return this.app.workspace.getActiveFile();
  }

  async collectVaultWords(
    tagFilters: string[],
    tagMatchMode: TagMatchMode,
    onProgress?: (message: string, percent: number) => void,
  ): Promise<WeightedWord[]> {
    const allMarkdownFiles = this.app.vault.getMarkdownFiles();
    return this.processor.collectFromFiles(
      allMarkdownFiles,
      this.getBlacklistSet(),
      this.settings.render,
      onProgress,
      {
        tagFilters,
        tagMatchMode,
      },
    );
  }

  async collectFileWords(file: TFile, onProgress?: (message: string, percent: number) => void): Promise<WeightedWord[]> {
    return this.processor.collectFromFiles([file], this.getBlacklistSet(), this.settings.render, onProgress);
  }

  async drawWordCloud(options: WordCloudRenderOptions): Promise<void> {
    return drawWordCloud(options, this.settings.render);
  }

  async openSearchForWord(word: string, options: SearchOptions = {}): Promise<void> {
    return openSearchForWord(this.app, word, options);
  }

  async loadSettings(): Promise<void> {
    const loaded = await this.loadData();
    const loadedBlacklist = loaded?.blacklistWords;
    const loadedRender = loaded?.render;
    this.settings = {
      blacklistWords: this.normalizeBlacklistWords(loadedBlacklist),
      render: this.normalizeRenderSettings(loadedRender),
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  async addBlacklistWord(rawWord: string): Promise<boolean> {
    const normalizedWord = this.normalizeBlacklistWord(rawWord);
    if (!normalizedWord || this.settings.blacklistWords.includes(normalizedWord)) {
      return false;
    }

    this.settings.blacklistWords = [...this.settings.blacklistWords, normalizedWord];
    await this.saveSettings();
    return true;
  }

  async removeBlacklistWord(rawWord: string): Promise<void> {
    const normalizedWord = this.normalizeBlacklistWord(rawWord);
    this.settings.blacklistWords = this.settings.blacklistWords.filter((word) => word !== normalizedWord);
    await this.saveSettings();
  }

  async resetBlacklistWords(): Promise<void> {
    this.settings.blacklistWords = [...DEFAULT_SETTINGS.blacklistWords];
    await this.saveSettings();
  }

  async updateRenderSettings(patch: Partial<RenderSettings>): Promise<void> {
    const merged = {
      ...this.settings.render,
      ...patch,
    };
    this.settings.render = this.normalizeRenderSettings(merged);
    await this.saveSettings();
  }

  async resetRenderSettings(): Promise<void> {
    this.settings.render = { ...DEFAULT_SETTINGS.render };
    await this.saveSettings();
  }

  private getBlacklistSet(): Set<string> {
    return new Set(this.settings.blacklistWords.map((word) => this.normalizeBlacklistWord(word)).filter(Boolean));
  }

  private normalizeBlacklistWords(rawValue: unknown): string[] {
    if (!Array.isArray(rawValue)) {
      return [...DEFAULT_SETTINGS.blacklistWords];
    }

    const seen = new Set<string>();
    for (const entry of rawValue) {
      if (typeof entry !== 'string') {
        continue;
      }
      const normalized = this.normalizeBlacklistWord(entry);
      if (normalized) {
        seen.add(normalized);
      }
    }

    return seen.size > 0 ? [...seen] : [...DEFAULT_SETTINGS.blacklistWords];
  }

  private normalizeBlacklistWord(word: string): string {
    return word.trim().toLowerCase();
  }

  private normalizeRenderSettings(rawValue: unknown): RenderSettings {
    const raw = (rawValue && typeof rawValue === 'object') ? rawValue as Partial<RenderSettings> : {};

    const rotationPreset = raw.rotationPreset === 'horizontal'
      || raw.rotationPreset === 'mostly-horizontal'
      || raw.rotationPreset === 'mixed'
      || raw.rotationPreset === 'vertical'
      ? raw.rotationPreset
      : DEFAULT_SETTINGS.render.rotationPreset;

    const spiral = raw.spiral === 'archimedean' || raw.spiral === 'rectangular'
      ? raw.spiral
      : DEFAULT_SETTINGS.render.spiral;

    const wordPadding = this.clampNumber(raw.wordPadding, 0, 12, DEFAULT_SETTINGS.render.wordPadding);
    const minFontSize = this.clampNumber(raw.minFontSize, 8, 64, DEFAULT_SETTINGS.render.minFontSize);
    const maxFontSize = this.clampNumber(raw.maxFontSize, 16, 140, DEFAULT_SETTINGS.render.maxFontSize);
    const safeMinFontSize = Math.min(minFontSize, maxFontSize - 1);
    const safeMaxFontSize = Math.max(maxFontSize, safeMinFontSize + 1);

    const fontFamily = typeof raw.fontFamily === 'string' && raw.fontFamily.trim().length > 0
      ? raw.fontFamily.trim()
      : DEFAULT_SETTINGS.render.fontFamily;

    const scalingMode = raw.scalingMode === 'linear'
      || raw.scalingMode === 'power'
      || raw.scalingMode === 'log'
      || raw.scalingMode === 'rank'
      ? raw.scalingMode
      : DEFAULT_SETTINGS.render.scalingMode;

    const emphasis = this.clampFloat(raw.emphasis, 0.5, 3, DEFAULT_SETTINGS.render.emphasis);

    const showCountInWordText = typeof raw.showCountInWordText === 'boolean'
      ? raw.showCountInWordText
      : DEFAULT_SETTINGS.render.showCountInWordText;

    const countLabelFormat = raw.countLabelFormat === 'paren'
      || raw.countLabelFormat === 'dot'
      || raw.countLabelFormat === 'colon'
      ? raw.countLabelFormat
      : DEFAULT_SETTINGS.render.countLabelFormat;

    const countLabelMinCount = this.clampNumber(raw.countLabelMinCount, 1, 100, DEFAULT_SETTINGS.render.countLabelMinCount);

    const progressDetail = raw.progressDetail === 'minimal'
      || raw.progressDetail === 'balanced'
      || raw.progressDetail === 'detailed'
      || raw.progressDetail === 'unhinged'
      ? raw.progressDetail
      : DEFAULT_SETTINGS.render.progressDetail;

    const scanBatchSize = this.clampNumber(raw.scanBatchSize, 8, 64, DEFAULT_SETTINGS.render.scanBatchSize);
    const layoutTimeIntervalMs = this.clampNumber(
      raw.layoutTimeIntervalMs,
      8,
      40,
      DEFAULT_SETTINGS.render.layoutTimeIntervalMs,
    );

    const deterministicLayout = typeof raw.deterministicLayout === 'boolean'
      ? raw.deterministicLayout
      : DEFAULT_SETTINGS.render.deterministicLayout;

    const randomSeed = this.clampNumber(raw.randomSeed, 1, 2147483647, DEFAULT_SETTINGS.render.randomSeed);

    return {
      rotationPreset,
      spiral,
      wordPadding,
      minFontSize: safeMinFontSize,
      maxFontSize: safeMaxFontSize,
      fontFamily,
      scalingMode,
      emphasis,
      showCountInWordText,
      countLabelFormat,
      countLabelMinCount,
      progressDetail,
      scanBatchSize,
      layoutTimeIntervalMs,
      deterministicLayout,
      randomSeed,
    };
  }

  private clampNumber(value: unknown, min: number, max: number, fallback: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, Math.round(value)));
  }

  private clampFloat(value: unknown, min: number, max: number, fallback: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, value));
  }
}
