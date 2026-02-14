import { ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_NOTE_WORD_CLOUD } from '../constants';
import type { WordCloudServices } from '../types';

export class NoteWordCloudView extends ItemView {
  private readonly services: WordCloudServices;
  private renderNonce = 0;
  private selectedFilePath = '';

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
    refreshButton.setAttr('aria-label', 'Refresh word cloud');

    const canvasEl = contentEl.createDiv({ cls: 'vault-word-cloud-canvas' });

    this.updateOpenFileOptions(fileSelectEl);

    this.registerDomEvent(fileSelectEl, 'change', () => {
      this.selectedFilePath = fileSelectEl.value;
      void this.renderCloud(canvasEl);
    });

    this.registerDomEvent(activeButton, 'click', () => {
      const activeFile = this.services.getActiveFile();
      if (activeFile) {
        this.selectedFilePath = activeFile.path;
        this.updateOpenFileOptions(fileSelectEl);
        fileSelectEl.value = this.selectedFilePath;
      }
      void this.renderCloud(canvasEl);
    });

    this.registerDomEvent(refreshButton, 'click', () => {
      this.updateOpenFileOptions(fileSelectEl);
      if (!fileSelectEl.value && this.selectedFilePath) {
        this.selectedFilePath = '';
      }
      void this.renderCloud(canvasEl);
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
        void this.renderCloud(canvasEl);
      }
    }));

    await this.renderCloud(canvasEl);
  }

  async onResize(): Promise<void> {
    const canvasEl = this.contentEl.querySelector('.vault-word-cloud-canvas');
    if (canvasEl instanceof HTMLDivElement) {
      await this.renderCloud(canvasEl);
    }
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
        loadingEl.remove();
        containerEl.createDiv({
          cls: 'vault-word-cloud-state',
          text: 'Open a markdown note and select it to view a note-specific word cloud.',
        });
        return;
      }

      const words = await this.services.collectFileWords(targetFile, updateProgress);

      if (words.length === 0) {
        loadingEl.remove();
        containerEl.createDiv({
          cls: 'vault-word-cloud-state',
          text: `No words found in ${targetFile.basename}.`,
        });
        return;
      }

      await this.services.drawWordCloud({
        containerEl,
        words,
        ariaLabel: `Word cloud for ${targetFile.basename}`,
        onProgress: updateProgress,
        onRefresh: () => this.renderCloud(containerEl),
        onWordClick: (word) => {
          void this.services.openSearchForWord(word, { filePath: targetFile.path });
        },
      });

      if (activeNonce !== this.renderNonce) {
        return;
      }

      loadingEl.remove();
    } catch (error) {
      loadingEl.remove();
      console.error('Note word cloud: failed to render cloud', error);
      containerEl.createDiv({
        cls: 'vault-word-cloud-state',
        text: 'Could not render the word cloud. Open developer console for details.',
      });
    }
  }
}
