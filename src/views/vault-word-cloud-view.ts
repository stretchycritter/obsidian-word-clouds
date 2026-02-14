import { ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_VAULT_WORD_CLOUD } from '../constants';
import type { TagMatchMode, WordCloudServices } from '../types';

export class VaultWordCloudView extends ItemView {
  private readonly services: WordCloudServices;
  private renderNonce = 0;
  private selectedTags: string[] = [];
  private tagMatchMode: TagMatchMode = 'any';

  constructor(leaf: WorkspaceLeaf, services: WordCloudServices) {
    super(leaf);
    this.services = services;
  }

  getViewType(): string {
    return VIEW_TYPE_VAULT_WORD_CLOUD;
  }

  getDisplayText(): string {
    return 'Word clouds';
  }

  getIcon(): string {
    return 'cloud';
  }

  async onOpen(): Promise<void> {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('vault-word-cloud-view');

    const topEl = contentEl.createDiv({ cls: 'vault-word-cloud-top' });

    const headerEl = topEl.createDiv({ cls: 'vault-word-cloud-header' });
    headerEl.createEl('h2', { text: 'Word clouds', cls: 'vault-word-cloud-title' });

    const controlsEl = topEl.createDiv({ cls: 'vault-word-cloud-controls' });

    const tagPickerEl = controlsEl.createDiv({ cls: 'vault-word-cloud-tag-filter' });
    const tagSelectEl = tagPickerEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    tagSelectEl.id = 'vault-word-cloud-tag-select';
    tagSelectEl.setAttr('aria-label', 'Add tag filter');

    const modeEl = controlsEl.createDiv({ cls: 'vault-word-cloud-match-mode' });
    modeEl.createEl('span', { text: 'Match', cls: 'vault-word-cloud-tag-label' });
    const modeSelectEl = modeEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    modeSelectEl.createEl('option', { text: 'Any', value: 'any' });
    modeSelectEl.createEl('option', { text: 'All', value: 'all' });
    modeSelectEl.value = this.tagMatchMode;
    modeSelectEl.setAttr('aria-label', 'Tag match mode');

    const refreshButton = controlsEl.createEl('button', {
      text: 'Refresh',
      cls: 'vault-word-cloud-refresh',
    });
    refreshButton.setAttr('aria-label', 'Refresh word cloud');

    const appliedTagsEl = topEl.createDiv({ cls: 'vault-word-cloud-applied-tags' });
    const canvasEl = contentEl.createDiv({ cls: 'vault-word-cloud-canvas' });

    this.updateTagPickerOptions(tagSelectEl);
    this.renderAppliedTagChips(appliedTagsEl, tagSelectEl, canvasEl);

    this.registerDomEvent(tagSelectEl, 'change', () => {
      const selectedTag = tagSelectEl.value;
      if (selectedTag && !this.selectedTags.includes(selectedTag)) {
        this.selectedTags.push(selectedTag);
      }

      tagSelectEl.value = '';
      this.updateTagPickerOptions(tagSelectEl);
      this.renderAppliedTagChips(appliedTagsEl, tagSelectEl, canvasEl);
      void this.renderCloud(canvasEl);
    });

    this.registerDomEvent(modeSelectEl, 'change', () => {
      this.tagMatchMode = modeSelectEl.value === 'all' ? 'all' : 'any';
      void this.renderCloud(canvasEl);
    });

    this.registerDomEvent(refreshButton, 'click', () => {
      this.updateTagPickerOptions(tagSelectEl);
      void this.renderCloud(canvasEl);
    });

    await this.renderCloud(canvasEl);
  }

  async onResize(): Promise<void> {
    const canvasEl = this.contentEl.querySelector('.vault-word-cloud-canvas');
    if (canvasEl instanceof HTMLDivElement) {
      await this.renderCloud(canvasEl);
    }
  }

  private updateTagPickerOptions(selectEl: HTMLSelectElement): void {
    const tags = this.services.getAvailableTags();
    const selectedSet = new Set(this.selectedTags);

    selectEl.empty();
    selectEl.createEl('option', { text: 'Add tag filter...', value: '' });

    for (const tag of tags) {
      const option = selectEl.createEl('option', { text: tag, value: tag });
      option.disabled = selectedSet.has(tag);
    }

    selectEl.value = '';
  }

  private renderAppliedTagChips(
    chipsEl: HTMLDivElement,
    tagSelectEl: HTMLSelectElement,
    canvasEl: HTMLDivElement,
  ): void {
    chipsEl.empty();

    if (this.selectedTags.length === 0) {
      chipsEl.createSpan({ cls: 'vault-word-cloud-chip-empty', text: 'No tag filters applied.' });
      return;
    }

    for (const tag of this.selectedTags) {
      const chipEl = chipsEl.createDiv({ cls: 'vault-word-cloud-chip' });
      chipEl.createSpan({ cls: 'vault-word-cloud-chip-text', text: tag });

      const removeButton = chipEl.createEl('button', {
        cls: 'vault-word-cloud-chip-remove',
        text: 'x',
      });
      removeButton.setAttr('aria-label', `Remove ${tag} filter`);

      this.registerDomEvent(removeButton, 'click', () => {
        this.selectedTags = this.selectedTags.filter((value) => value !== tag);
        this.updateTagPickerOptions(tagSelectEl);
        this.renderAppliedTagChips(chipsEl, tagSelectEl, canvasEl);
        void this.renderCloud(canvasEl);
      });
    }
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
      const words = await this.services.collectVaultWords(this.selectedTags, this.tagMatchMode, updateProgress);

      if (words.length === 0) {
        loadingEl.remove();
        containerEl.createDiv({
          cls: 'vault-word-cloud-state',
          text: this.selectedTags.length > 0
            ? 'No words found for the selected tag filters.'
            : 'No words found. Add more note content and refresh.',
        });
        return;
      }

      await this.services.drawWordCloud({
        containerEl,
        words,
        ariaLabel: 'Word cloud based on markdown files in the vault',
        onProgress: updateProgress,
        onWordClick: (word) => {
          void this.services.openSearchForWord(word, {
            tags: this.selectedTags,
            tagMatchMode: this.tagMatchMode,
          });
        },
      });

      if (activeNonce !== this.renderNonce) {
        return;
      }

      loadingEl.remove();
    } catch (error) {
      loadingEl.remove();
      console.error('Vault word cloud: failed to render cloud', error);
      containerEl.createDiv({
        cls: 'vault-word-cloud-state',
        text: 'Could not render the word cloud. Open developer console for details.',
      });
    }
  }
}
