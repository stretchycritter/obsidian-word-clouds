import { ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_VAULT_WORD_CLOUD } from '@/ui/constants';
import type { RenderSettings, WordCloudFilterSettings } from '@/settings/types';
import type { WordCloudServices } from '@/services/types';
import { WordCloudFilterPanel } from '@/ui/components/filter-panel';
import { renderWordCloudCanvas } from '@/ui/renderers/word-cloud-canvas-renderer';

export class VaultWordCloudView extends ItemView {
  private readonly services: WordCloudServices;
  private readonly renderNonce = { value: 0 };
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
    const registerElementEvent = (
      element: HTMLElement,
      type: keyof HTMLElementEventMap,
      callback: (event: Event) => void,
    ): void => {
      this.registerDomEvent(element, type, callback as EventListener);
    };

    const filterPanel = new WordCloudFilterPanel({
      services: this.services,
      containerEl: controlsEl,
      registerDomEvent: registerElementEvent,
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

  private async renderCloud(
    containerEl: HTMLDivElement,
    renderSettingsOverride?: Partial<RenderSettings>,
  ): Promise<void> {
    await renderWordCloudCanvas({
      nonceRef: this.renderNonce,
      containerEl,
      services: this.services,
      filters: this.filters,
      errorLogPrefix: 'Vault word cloud',
      createStatusHandle: (initialText) => {
        const stateEl = containerEl.createDiv({ cls: 'vault-word-cloud-state', text: initialText });
        return {
          setText: (text) => stateEl.setText(text),
          remove: () => stateEl.remove(),
        };
      },
      renderEmptyState: (message) => {
        containerEl.createDiv({
          cls: 'vault-word-cloud-state',
          text: message,
        });
      },
      renderErrorState: (message) => {
        containerEl.createDiv({
          cls: 'vault-word-cloud-state',
          text: message,
        });
      },
      resolveScopeFilePath: () => this.services.getActiveFile()?.path ?? '',
      resolveExtraContext: () => null,
      getAriaLabel: () => 'Word cloud based on markdown files in the vault',
      getNoWordsMessage: () => 'No words found for the selected filters.',
      getSearchOptions: ({ scopeFilePath, filters }) => ({
        includeTags: filters?.includeTags ?? [],
        excludeTags: filters?.excludeTags ?? [],
        tagMatchMode: filters?.tagMatchMode ?? 'any',
        filePath: filters?.scope.mode === 'active-file'
          ? scopeFilePath
          : undefined,
      }),
      getRenderSettingsOverride: () => renderSettingsOverride,
      onRefresh: () => this.renderCloud(containerEl, renderSettingsOverride),
    });
  }
}
