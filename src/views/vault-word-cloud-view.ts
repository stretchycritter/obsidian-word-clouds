import { ItemView, Notice, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_VAULT_WORD_CLOUD } from '../constants';
import type { WordCloudFilterSettings, WordCloudServices } from '../types';
import { WordCloudFilterPanel } from './word-cloud-filter-panel';

export class VaultWordCloudView extends ItemView {
  private readonly services: WordCloudServices;
  private renderNonce = 0;
  private filters: WordCloudFilterSettings;

  constructor(leaf: WorkspaceLeaf, services: WordCloudServices) {
    super(leaf);
    this.services = services;
    this.filters = services.getFilterSettings();
  }

  getViewType(): string {
    return VIEW_TYPE_VAULT_WORD_CLOUD;
  }

  getDisplayText(): string {
    return 'Vault Word Cloud';
  }

  getIcon(): string {
    return 'cloud';
  }

  async onOpen(): Promise<void> {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('vault-word-cloud-view');

    this.filters = this.services.getFilterSettings();

    const topEl = contentEl.createDiv({ cls: 'vault-word-cloud-top' });
    const headerEl = topEl.createDiv({ cls: 'vault-word-cloud-header' });
    headerEl.createEl('h2', { text: 'Word clouds', cls: 'vault-word-cloud-title' });

    const controlsEl = topEl.createDiv({ cls: 'vault-word-cloud-controls' });
    const canvasEl = contentEl.createDiv({ cls: 'vault-word-cloud-canvas' });

    const filterPanel = new WordCloudFilterPanel({
      services: this.services,
      containerEl: controlsEl,
      registerDomEvent: (element, type, callback) => this.registerDomEvent(element, type, callback),
      filters: this.filters,
      onChange: async (nextFilters) => {
        this.filters = nextFilters;
        await this.services.updateFilterSettings(this.filters);
        this.filters = this.services.getFilterSettings();
        filterPanel.setFilters(this.filters);
        await this.renderCloud(canvasEl);
      },
    });

    await this.renderCloud(canvasEl);
  }

  async onResize(): Promise<void> {
    const canvasEl = this.contentEl.querySelector('.vault-word-cloud-canvas');
    if (canvasEl instanceof HTMLDivElement) {
      await this.renderCloud(canvasEl);
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
      const activeFilePath = this.services.getActiveFile()?.path ?? '';
      const words = await this.services.collectVaultWords({
        sourceRules: {
          scope: {
            ...this.filters.scope,
            activeFilePath,
          },
          includeTags: this.filters.includeTags,
          excludeTags: this.filters.excludeTags,
          tagMatchMode: this.filters.tagMatchMode,
          frontmatterRules: this.filters.frontmatterRules,
        },
        frequency: this.filters.frequency,
      }, updateProgress);

      if (words.length === 0) {
        loadingEl.remove();
        containerEl.createDiv({
          cls: 'vault-word-cloud-state',
          text: 'No words found for the selected filters.',
        });
        return;
      }

      await this.services.drawWordCloud({
        containerEl,
        words,
        ariaLabel: 'Word cloud based on markdown files in the vault',
        onProgress: updateProgress,
        onRefresh: () => this.renderCloud(containerEl),
        onExcludeInVault: async (word) => {
          const added = await this.services.addBlacklistWord(word);
          new Notice(added ? `Excluded "${word}" from word clouds.` : `"${word}" is already excluded.`);
          await this.renderCloud(containerEl);
        },
        onWordClick: (word) => {
          void this.services.openSearchForWord(word, {
            includeTags: this.filters.includeTags,
            excludeTags: this.filters.excludeTags,
            tagMatchMode: this.filters.tagMatchMode,
            filePath: this.filters.scope.mode === 'active-file'
              ? activeFilePath
              : undefined,
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
