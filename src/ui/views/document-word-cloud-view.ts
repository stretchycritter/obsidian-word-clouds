import { ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_VAULT_WORD_CLOUD } from '@/ui/constants';
import type { RenderSettings, WordCloudFilterSettings } from '@/settings/types';
import type { WordCloudServices } from '@/services/types';
import { WordCloudFilterPanel } from '@/ui/components/filter-panel';
import { renderWordCloudCanvas } from '@/core';
import { t } from '@/i18n';

export class VaultWordCloudView extends ItemView {
  private readonly services: WordCloudServices;
  private readonly renderNonce = { value: 0 };
  private filters: WordCloudFilterSettings;
  private isEditPanelOpen = false;
  private readonly persistentControlsRef = {
    containerEl: { current: null as HTMLElement | null },
    liveRef: {
      svgEl: { current: null as SVGSVGElement | null },
      viewportControls: { current: { zoomIn: () => {}, zoomOut: () => {}, resetView: () => {} } },
    },
  };

  constructor(leaf: WorkspaceLeaf, services: WordCloudServices) {
    super(leaf);
    this.services = services;
    this.filters = services.getFilterSettings();
  }

  getViewType(): string {
    return VIEW_TYPE_VAULT_WORD_CLOUD;
  }

  getDisplayText(): string {
    return t('ui.views.vault.displayText');
  }

  getIcon(): string {
    return 'cloud';
  }

  async onOpen(): Promise<void> {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('vault-word-cloud-view');

    // Reset controls ref since the DOM was cleared
    this.persistentControlsRef.containerEl.current = null;

    this.filters = this.services.getFilterSettings();

    const shellEl = contentEl.createDiv({ cls: 'word-cloud-view-shell' });
    const canvasEl = shellEl.createDiv({ cls: 'vault-word-cloud-canvas' });
    const editPanelEl = shellEl.createDiv({ cls: 'word-cloud-inline-edit-panel' });
    const editPanelContentEl = editPanelEl.createDiv({ cls: 'word-cloud-inline-edit-content' });

    const registerElementEvent = (
      element: HTMLElement,
      type: keyof HTMLElementEventMap,
      callback: (event: Event) => void,
    ): void => {
      this.registerDomEvent(element, type, callback as EventListener);
    };

    const setEditPanelOpen = (isOpen: boolean): void => {
      this.isEditPanelOpen = isOpen;
      editPanelEl.toggleClass('is-open', isOpen);
      if (!isOpen) {
        editPanelEl.setAttr('hidden', 'true');
        return;
      }

      editPanelEl.removeAttribute('hidden');
    };

    const filterPanel = new WordCloudFilterPanel({
      services: this.services,
      containerEl: editPanelContentEl,
      registerDomEvent: registerElementEvent,
      filters: this.filters,
      onChange: async (nextFilters) => {
        this.filters = nextFilters;
        await this.services.updateFilterSettings(this.filters);
        this.filters = this.services.getFilterSettings();
        filterPanel.setFilters(this.filters);
        await this.renderCloud(canvasEl, setEditPanelOpen);
      },
    });

    setEditPanelOpen(false);

    this.registerDomEvent(editPanelEl, 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setEditPanelOpen(false);
      }
    });

    await this.renderCloud(canvasEl, setEditPanelOpen);
  }

  async onResize(): Promise<void> {
    const canvasEl = this.contentEl.querySelector('.vault-word-cloud-canvas');
    if (canvasEl instanceof HTMLDivElement) {
      await this.renderCloud(canvasEl);
    }
  }

  private async renderCloud(
    containerEl: HTMLDivElement,
    setEditPanelOpen?: (isOpen: boolean) => void,
    renderSettingsOverride?: Partial<RenderSettings>,
  ): Promise<void> {
    await renderWordCloudCanvas({
      nonceRef: this.renderNonce,
      containerEl,
      preserveContainerDuringRender: true,
      persistentControlsRef: this.persistentControlsRef,
      services: this.services,
      filters: this.filters,
      errorLogPrefix: 'Vault word cloud',
      createStatusHandle: (initialText, targetEl) => {
        const renderTargetEl = targetEl ?? containerEl;
        const stateEl = renderTargetEl.createDiv({ cls: 'vault-word-cloud-state', text: initialText });
        return {
          setText: (text) => stateEl.setText(text),
          remove: () => stateEl.remove(),
        };
      },
      renderEmptyState: (message, targetEl) => {
        const renderTargetEl = targetEl ?? containerEl;
        renderTargetEl.createDiv({
          cls: 'vault-word-cloud-state',
          text: message,
        });
      },
      renderErrorState: (message, targetEl) => {
        const renderTargetEl = targetEl ?? containerEl;
        renderTargetEl.createDiv({
          cls: 'vault-word-cloud-state',
          text: message,
        });
      },
      resolveScopeFilePath: () => this.services.getActiveFile()?.path ?? '',
      resolveExtraContext: () => null,
      getAriaLabel: () => t('ui.views.vault.ariaLabel'),
      getNoWordsMessage: () => t('ui.views.common.noWordsForFilters'),
      getSearchOptions: ({ scopeFilePath, filters }) => ({
        includeTags: filters?.includeTags ?? [],
        excludeTags: filters?.excludeTags ?? [],
        tagMatchMode: filters?.tagMatchMode ?? 'any',
        filePath: filters?.scope.mode === 'active-file'
          ? scopeFilePath
          : undefined,
      }),
      getRenderSettingsOverride: () => renderSettingsOverride,
      getDrawOptions: () => ({
        onEdit: () => {
          const toggle = setEditPanelOpen ?? (() => undefined);
          toggle(!this.isEditPanelOpen);
        },
        enableOverlayControls: true,
        showEditControl: true,
      }),
      onRefresh: () => this.renderCloud(containerEl, setEditPanelOpen, renderSettingsOverride),
    });
  }
}
