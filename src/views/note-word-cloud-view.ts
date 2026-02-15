import { ItemView, Notice, type TFile, WorkspaceLeaf } from 'obsidian';
import { drawFrequencyChart } from '../rendering/frequency-chart-renderer';
import { VIEW_TYPE_NOTE_WORD_CLOUD } from '../constants';
import type { WeightedWord, WordCloudServices } from '../types';

type NoteViewTab = 'cloud' | 'frequency';

export class NoteWordCloudView extends ItemView {
  private readonly services: WordCloudServices;
  private renderNonce = 0;
  private selectedFilePath = '';
  private activeTab: NoteViewTab = 'cloud';
  private latestWords: WeightedWord[] = [];
  private latestFile: TFile | null = null;
  private frequencyRendered = false;
  private cloudCanvasEl: HTMLDivElement | null = null;
  private frequencyCanvasEl: HTMLDivElement | null = null;
  private cloudTabButtonEl: HTMLButtonElement | null = null;
  private frequencyTabButtonEl: HTMLButtonElement | null = null;

  constructor(leaf: WorkspaceLeaf, services: WordCloudServices) {
    super(leaf);
    this.services = services;
  }

  getViewType(): string {
    return VIEW_TYPE_NOTE_WORD_CLOUD;
  }

  getDisplayText(): string {
    return 'Note word clouds';
  }

  getIcon(): string {
    return 'file-text';
  }

  async onOpen(): Promise<void> {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('vault-word-cloud-view');

    const topEl = contentEl.createDiv({ cls: 'vault-word-cloud-top' });
    const headerEl = topEl.createDiv({ cls: 'vault-word-cloud-header' });
    headerEl.createEl('h2', { text: 'Note word clouds', cls: 'vault-word-cloud-title' });

    const controlsEl = topEl.createDiv({ cls: 'vault-word-cloud-controls' });

    const fileFilterEl = controlsEl.createDiv({ cls: 'vault-word-cloud-tag-filter' });
    const fileLabelEl = fileFilterEl.createEl('label', { text: 'Open note', cls: 'vault-word-cloud-tag-label' });
    const fileSelectEl = fileFilterEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    fileSelectEl.id = 'vault-word-cloud-note-select';
    fileLabelEl.setAttr('for', fileSelectEl.id);
    fileSelectEl.setAttr('aria-label', 'Choose an open note');

    const activeButton = controlsEl.createEl('button', {
      text: 'Use active note',
      cls: 'vault-word-cloud-refresh',
    });
    activeButton.setAttr('aria-label', 'Use active note');

    const refreshButton = controlsEl.createEl('button', {
      text: 'Refresh',
      cls: 'vault-word-cloud-refresh',
    });
    refreshButton.setAttr('aria-label', 'Refresh note insights');

    const tabsEl = contentEl.createDiv({ cls: 'note-word-cloud-tabs' });
    tabsEl.setAttr('role', 'tablist');
    tabsEl.setAttr('aria-label', 'Note word cloud visualizations');

    const cloudTabButton = tabsEl.createEl('button', {
      cls: 'note-word-cloud-tab is-active',
      text: 'Word cloud',
    });
    cloudTabButton.type = 'button';
    cloudTabButton.id = 'note-word-cloud-tab-cloud';
    cloudTabButton.setAttr('role', 'tab');
    cloudTabButton.setAttr('aria-controls', 'note-word-cloud-panel-cloud');
    cloudTabButton.setAttr('aria-selected', 'true');
    cloudTabButton.setAttr('tabindex', '0');

    const frequencyTabButton = tabsEl.createEl('button', {
      cls: 'note-word-cloud-tab',
      text: 'Frequency',
    });
    frequencyTabButton.type = 'button';
    frequencyTabButton.id = 'note-word-cloud-tab-frequency';
    frequencyTabButton.setAttr('role', 'tab');
    frequencyTabButton.setAttr('aria-controls', 'note-word-cloud-panel-frequency');
    frequencyTabButton.setAttr('aria-selected', 'false');
    frequencyTabButton.setAttr('tabindex', '-1');

    const panelsEl = contentEl.createDiv({ cls: 'note-word-cloud-panels' });

    const cloudPanelEl = panelsEl.createDiv({ cls: 'note-word-cloud-panel is-active' });
    cloudPanelEl.id = 'note-word-cloud-panel-cloud';
    cloudPanelEl.setAttr('role', 'tabpanel');
    cloudPanelEl.setAttr('aria-labelledby', cloudTabButton.id);

    const frequencyPanelEl = panelsEl.createDiv({ cls: 'note-word-cloud-panel' });
    frequencyPanelEl.id = 'note-word-cloud-panel-frequency';
    frequencyPanelEl.setAttr('role', 'tabpanel');
    frequencyPanelEl.setAttr('aria-labelledby', frequencyTabButton.id);
    frequencyPanelEl.setAttr('hidden', '');

    const cloudCanvasEl = cloudPanelEl.createDiv({ cls: 'vault-word-cloud-canvas' });
    const frequencyCanvasEl = frequencyPanelEl.createDiv({ cls: 'note-word-cloud-frequency-canvas' });

    this.cloudCanvasEl = cloudCanvasEl;
    this.frequencyCanvasEl = frequencyCanvasEl;
    this.cloudTabButtonEl = cloudTabButton;
    this.frequencyTabButtonEl = frequencyTabButton;

    this.updateOpenFileOptions(fileSelectEl);

    this.registerDomEvent(fileSelectEl, 'change', () => {
      this.selectedFilePath = fileSelectEl.value;
      void this.renderCloud(cloudCanvasEl);
    });

    this.registerDomEvent(activeButton, 'click', () => {
      const activeFile = this.services.getActiveFile();
      if (activeFile) {
        this.selectedFilePath = activeFile.path;
        this.updateOpenFileOptions(fileSelectEl);
        fileSelectEl.value = this.selectedFilePath;
      }
      void this.renderCloud(cloudCanvasEl);
    });

    this.registerDomEvent(refreshButton, 'click', () => {
      this.updateOpenFileOptions(fileSelectEl);
      if (!fileSelectEl.value && this.selectedFilePath) {
        this.selectedFilePath = '';
      }
      void this.renderCloud(cloudCanvasEl);
    });

    this.registerDomEvent(cloudTabButton, 'click', () => {
      this.switchTab('cloud', cloudPanelEl, frequencyPanelEl);
    });

    this.registerDomEvent(frequencyTabButton, 'click', () => {
      this.switchTab('frequency', cloudPanelEl, frequencyPanelEl);
      this.renderFrequencyChart(true);
    });

    this.registerDomEvent(cloudTabButton, 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        frequencyTabButton.focus();
        this.switchTab('frequency', cloudPanelEl, frequencyPanelEl);
        this.renderFrequencyChart(true);
      }
    });

    this.registerDomEvent(frequencyTabButton, 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        cloudTabButton.focus();
        this.switchTab('cloud', cloudPanelEl, frequencyPanelEl);
      }
    });

    this.registerEvent(this.app.workspace.on('active-leaf-change', () => {
      const activeFile = this.services.getActiveFile();
      if (!activeFile) {
        return;
      }

      if (this.selectedFilePath !== activeFile.path) {
        this.selectedFilePath = activeFile.path;
        this.updateOpenFileOptions(fileSelectEl);
        fileSelectEl.value = this.selectedFilePath;
        void this.renderCloud(cloudCanvasEl);
      }
    }));

    await this.renderCloud(cloudCanvasEl);
  }

  onClose(): void {
    this.cloudCanvasEl = null;
    this.frequencyCanvasEl = null;
    this.cloudTabButtonEl = null;
    this.frequencyTabButtonEl = null;
  }

  async onResize(): Promise<void> {
    if (this.activeTab === 'cloud' && this.cloudCanvasEl) {
      await this.renderCloud(this.cloudCanvasEl);
      return;
    }

    if (this.activeTab === 'frequency') {
      this.renderFrequencyChart(true);
    }
  }

  private switchTab(tab: NoteViewTab, cloudPanelEl: HTMLDivElement, frequencyPanelEl: HTMLDivElement): void {
    this.activeTab = tab;
    const showCloud = tab === 'cloud';

    this.cloudTabButtonEl?.toggleClass('is-active', showCloud);
    this.cloudTabButtonEl?.setAttr('aria-selected', showCloud ? 'true' : 'false');
    this.cloudTabButtonEl?.setAttr('tabindex', showCloud ? '0' : '-1');

    this.frequencyTabButtonEl?.toggleClass('is-active', !showCloud);
    this.frequencyTabButtonEl?.setAttr('aria-selected', showCloud ? 'false' : 'true');
    this.frequencyTabButtonEl?.setAttr('tabindex', showCloud ? '-1' : '0');

    cloudPanelEl.toggleClass('is-active', showCloud);
    frequencyPanelEl.toggleClass('is-active', !showCloud);

    if (showCloud) {
      cloudPanelEl.removeAttribute('hidden');
      frequencyPanelEl.setAttr('hidden', '');
      return;
    }

    cloudPanelEl.setAttr('hidden', '');
    frequencyPanelEl.removeAttribute('hidden');
  }

  private updateOpenFileOptions(selectEl: HTMLSelectElement): void {
    const openFiles = this.services.getOpenMarkdownFiles();
    const activeFile = this.services.getActiveFile();

    if (!this.selectedFilePath && activeFile) {
      this.selectedFilePath = activeFile.path;
    }

    const selected = this.selectedFilePath;
    selectEl.empty();

    if (openFiles.length === 0) {
      selectEl.createEl('option', { text: 'No open markdown notes', value: '' });
      this.selectedFilePath = '';
      return;
    }

    for (const file of openFiles) {
      const option = selectEl.createEl('option', { text: file.path, value: file.path });
      option.selected = file.path === selected;
    }

    this.selectedFilePath = selectEl.value;
  }

  private async renderCloud(containerEl: HTMLDivElement): Promise<void> {
    const activeNonce = ++this.renderNonce;
    containerEl.empty();
    const loadingEl = containerEl.createDiv({ cls: 'vault-word-cloud-state', text: 'Building cloud...' });
    const updateProgress = (message: string, percent: number): void => {
      if (activeNonce !== this.renderNonce) {
        return;
      }
      loadingEl.setText(`${message} (${percent}%)`);
    };

    try {
      const targetFile = this.services.getOpenMarkdownFiles().find((file) => file.path === this.selectedFilePath);
      if (!targetFile) {
        this.latestWords = [];
        this.latestFile = null;
        this.frequencyRendered = false;
        loadingEl.remove();
        containerEl.createDiv({
          cls: 'vault-word-cloud-state',
          text: 'Open a markdown note and select it to view a note-specific word cloud.',
        });

        if (this.activeTab === 'frequency') {
          this.renderFrequencyChart(true);
        }

        return;
      }

      const words = await this.services.collectFileWords(targetFile, updateProgress);

      if (words.length === 0) {
        this.latestWords = [];
        this.latestFile = targetFile;
        this.frequencyRendered = false;
        loadingEl.remove();
        containerEl.createDiv({
          cls: 'vault-word-cloud-state',
          text: `No words found in ${targetFile.basename}.`,
        });

        if (this.activeTab === 'frequency') {
          this.renderFrequencyChart(true);
        }

        return;
      }

      this.latestWords = words;
      this.latestFile = targetFile;
      this.frequencyRendered = false;

      await this.services.drawWordCloud({
        containerEl,
        words,
        ariaLabel: `Word cloud for ${targetFile.basename}`,
        onProgress: updateProgress,
        onRefresh: () => this.renderCloud(containerEl),
        onExcludeInVault: async (word) => {
          const added = await this.services.addBlacklistWord(word);
          new Notice(added ? `Excluded "${word}" from word clouds.` : `"${word}" is already excluded.`);
          await this.renderCloud(containerEl);
        },
        onWordClick: (word) => {
          void this.services.openSearchForWord(word, { filePath: targetFile.path });
        },
      });

      if (activeNonce !== this.renderNonce) {
        return;
      }

      loadingEl.remove();

      if (this.activeTab === 'frequency') {
        this.renderFrequencyChart(true);
      }
    } catch (error) {
      loadingEl.remove();
      console.error('Note word cloud: failed to render cloud', error);
      containerEl.createDiv({
        cls: 'vault-word-cloud-state',
        text: 'Could not render the word cloud. Open developer console for details.',
      });
    }
  }

  private renderFrequencyChart(force = false): void {
    if (!this.frequencyCanvasEl || (!force && this.frequencyRendered)) {
      return;
    }

    this.frequencyCanvasEl.empty();

    if (!this.latestFile) {
      this.frequencyCanvasEl.createDiv({
        cls: 'vault-word-cloud-state',
        text: 'Select an open markdown note to see the frequency distribution.',
      });
      this.frequencyRendered = true;
      return;
    }

    if (this.latestWords.length === 0) {
      this.frequencyCanvasEl.createDiv({
        cls: 'vault-word-cloud-state',
        text: `No words found in ${this.latestFile.basename}.`,
      });
      this.frequencyRendered = true;
      return;
    }

    drawFrequencyChart({
      containerEl: this.frequencyCanvasEl,
      words: this.latestWords,
      ariaLabel: `Word frequency chart for ${this.latestFile.basename}`,
    });

    this.frequencyRendered = true;
  }
}
