import { MarkdownView, Notice, Plugin, TFile, TFolder } from 'obsidian';
import { VIEW_TYPE_NOTE_WORD_CLOUD, VIEW_TYPE_VAULT_WORD_CLOUD } from './constants';
import { registerEmbeddedWordCloudProcessor } from './block-renderers/wordcloud-block-renderer';
import { openSearchForWord } from './actions/apply-search';
import { WordCloudProcessor } from './processing/processor';
import { DEFAULT_SETTINGS, VaultWordCloudSettingTab, type WordCloudSettings } from './settings';
import type {
  RenderSettings,
  SearchOptions,
  TagMatchMode,
  VaultCollectionOptions,
  WordCloudFilterSettings,
  WordCloudRenderOptions,
  WordCloudServices,
  WeightedWord,
} from './types';
import { drawWordCloud } from './rendering/word-cloud-renderer';
import { NoteWordCloudView } from './views/note-word-cloud-view';
import { VaultWordCloudView } from './views/vault-word-cloud-view';
import { EmbedWordCloudModal } from './modals/embed-word-cloud-modal';
import type { FrontmatterRule, SourceScope } from './pipeline/types';
import { normalizeTag } from './utils';

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

    this.addCommand({
      id: 'embed-word-cloud-in-document',
      name: 'Embed word cloud in document',
      callback: () => {
        this.openEmbedWordCloudWizard();
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

  getAvailableFolders(): string[] {
    return this.app.vault
      .getAllLoadedFiles()
      .filter((file): file is TFolder => file instanceof TFolder)
      .map((folder) => folder.path)
      .sort((a, b) => a.localeCompare(b));
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

  getFilterSettings(): WordCloudFilterSettings {
    return {
      scope: {
        mode: this.settings.filters.scope.mode,
        activeFilePath: this.settings.filters.scope.activeFilePath,
        folderPaths: [...this.settings.filters.scope.folderPaths],
      },
      includeTags: [...this.settings.filters.includeTags],
      excludeTags: [...this.settings.filters.excludeTags],
      tagMatchMode: this.settings.filters.tagMatchMode,
      frontmatterRules: this.settings.filters.frontmatterRules.map((rule) => ({ ...rule })),
      frequency: {
        minCount: this.settings.filters.frequency.minCount,
        maxCount: this.settings.filters.frequency.maxCount,
      },
    };
  }

  async updateFilterSettings(patch: Partial<WordCloudFilterSettings>): Promise<void> {
    const merged: WordCloudFilterSettings = {
      ...this.settings.filters,
      ...patch,
      scope: {
        ...this.settings.filters.scope,
        ...patch.scope,
      },
      frequency: {
        ...this.settings.filters.frequency,
        ...patch.frequency,
      },
      includeTags: patch.includeTags ?? this.settings.filters.includeTags,
      excludeTags: patch.excludeTags ?? this.settings.filters.excludeTags,
      frontmatterRules: patch.frontmatterRules ?? this.settings.filters.frontmatterRules,
    };

    this.settings.filters = this.normalizeFilterSettings(merged);
    await this.saveSettings();
  }

  async collectVaultWords(
    options: VaultCollectionOptions = {},
    onProgress?: (message: string, percent: number) => void,
  ): Promise<WeightedWord[]> {
    const allMarkdownFiles = this.app.vault.getMarkdownFiles();
    const sourceRules = options.sourceRules ?? {
      scope: this.settings.filters.scope,
      includeTags: this.settings.filters.includeTags,
      excludeTags: this.settings.filters.excludeTags,
      tagMatchMode: this.settings.filters.tagMatchMode,
      frontmatterRules: this.settings.filters.frontmatterRules,
    };
    const frequency = options.frequency ?? this.settings.filters.frequency;

    return this.processor.collectFromFiles(
      allMarkdownFiles,
      this.getBlacklistSet(),
      this.settings.render,
      onProgress,
      {
        sourceRules,
        frequency,
        excludeWords: options.excludeWords,
      },
    );
  }

  async collectFileWords(
    file: TFile,
    onProgress?: (message: string, percent: number) => void,
    options?: { excludeWords?: string[] },
  ): Promise<WeightedWord[]> {
    return this.processor.collectFromFiles([file], this.getBlacklistSet(), this.settings.render, onProgress, {
      excludeWords: options?.excludeWords,
    });
  }

  async drawWordCloud(options: WordCloudRenderOptions): Promise<void> {
    return drawWordCloud(options, this.settings.render);
  }

  async openSearchForWord(word: string, options: SearchOptions = {}): Promise<void> {
    return openSearchForWord(this.app, word, options);
  }

  openEmbedWordCloudWizard(): void {
    new EmbedWordCloudModal(this.app, this, (embedBlock) => {
      return this.insertEmbedAtCursor(embedBlock);
    }).open();
  }

  async loadSettings(): Promise<void> {
    const loaded = await this.loadData();
    const loadedBlacklist = loaded?.blacklistWords;
    const loadedRender = loaded?.render;
    this.settings = {
      blacklistWords: this.normalizeBlacklistWords(loadedBlacklist),
      render: this.normalizeRenderSettings(loadedRender),
      filters: this.normalizeFilterSettings(loaded?.filters),
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

  private normalizeFilterSettings(rawValue: unknown): WordCloudFilterSettings {
    const raw = (rawValue && typeof rawValue === 'object')
      ? rawValue as Partial<WordCloudFilterSettings>
      : {};

    const scope = this.normalizeScope(raw.scope);
    const includeTags = normalizeTagList(raw.includeTags);
    const excludeTags = normalizeTagList(raw.excludeTags).filter((tag) => !includeTags.includes(tag));
    const tagMatchMode: TagMatchMode = raw.tagMatchMode === 'all' ? 'all' : 'any';
    const frontmatterRules = normalizeFrontmatterRules(raw.frontmatterRules);
    const minCount = this.clampNumber(raw.frequency?.minCount, 1, 9999, DEFAULT_SETTINGS.filters.frequency.minCount);
    const maxCount = this.clampNumber(raw.frequency?.maxCount, 1, 9999, DEFAULT_SETTINGS.filters.frequency.maxCount);

    return {
      scope,
      includeTags,
      excludeTags,
      tagMatchMode,
      frontmatterRules,
      frequency: {
        minCount: Math.min(minCount, maxCount),
        maxCount: Math.max(minCount, maxCount),
      },
    };
  }

  private normalizeScope(rawValue: unknown): SourceScope {
    const raw = (rawValue && typeof rawValue === 'object') ? rawValue as Partial<SourceScope> : {};
    const mode = raw.mode === 'active-file' || raw.mode === 'folder' || raw.mode === 'vault'
      ? raw.mode
      : DEFAULT_SETTINGS.filters.scope.mode;

    const activeFilePath = typeof raw.activeFilePath === 'string'
      ? raw.activeFilePath.trim()
      : '';
    const folderPaths = Array.isArray(raw.folderPaths)
      ? [...new Set(raw.folderPaths.filter((path): path is string => typeof path === 'string').map((path) => path.trim()).filter(Boolean))]
      : [];

    return {
      mode,
      activeFilePath,
      folderPaths,
    };
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

    const wordTextMetric = raw.wordTextMetric === 'count' || raw.wordTextMetric === 'frequency'
      ? raw.wordTextMetric
      : DEFAULT_SETTINGS.render.wordTextMetric;

    const showWordTextMetricToggle = typeof raw.showWordTextMetricToggle === 'boolean'
      ? raw.showWordTextMetricToggle
      : DEFAULT_SETTINGS.render.showWordTextMetricToggle;

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
      wordTextMetric,
      showWordTextMetricToggle,
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

  private insertEmbedAtCursor(embedBlock: string): boolean {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
      new Notice('Open a markdown note to insert a word cloud embed.');
      return false;
    }

    const { editor } = view;
    const cursor = editor.getCursor();
    const currentLine = editor.getLine(cursor.line);

    const hasTextBeforeCursor = currentLine.slice(0, cursor.ch).trim().length > 0;
    const hasTextAfterCursor = currentLine.slice(cursor.ch).trim().length > 0;

    const prefix = hasTextBeforeCursor ? '\n' : '';
    const suffix = hasTextAfterCursor ? '\n' : '';
    const textToInsert = `${prefix}${embedBlock}${suffix}`;

    editor.replaceSelection(textToInsert);
    return true;
  }
}

function normalizeTagList(rawTags: unknown): string[] {
  if (!Array.isArray(rawTags)) {
    return [];
  }

  const tags = new Set<string>();
  for (const value of rawTags) {
    if (typeof value !== 'string') {
      continue;
    }
    const normalized = normalizeTag(value);
    if (normalized) {
      tags.add(normalized);
    }
  }

  return [...tags];
}

function normalizeFrontmatterRules(rawRules: unknown): FrontmatterRule[] {
  if (!Array.isArray(rawRules)) {
    return [];
  }

  const allowed = new Set(['equals', 'not-equals', 'contains', 'gt', 'gte', 'lt', 'lte', 'exists', 'not-exists']);
  const rules: FrontmatterRule[] = [];

  for (const rule of rawRules) {
    if (!rule || typeof rule !== 'object') {
      continue;
    }

    const candidate = rule as Partial<FrontmatterRule>;
    const key = typeof candidate.key === 'string' ? candidate.key.trim() : '';
    if (!key) {
      continue;
    }

    const operator = typeof candidate.operator === 'string' && allowed.has(candidate.operator)
      ? candidate.operator as FrontmatterRule['operator']
      : 'equals';
    const value = typeof candidate.value === 'string' ? candidate.value : '';

    rules.push({ key, operator, value });
  }

  return rules;
}
