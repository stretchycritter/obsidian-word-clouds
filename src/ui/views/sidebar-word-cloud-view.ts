import { ItemView, type TFile, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_NOTE_WORD_CLOUD } from '@/ui/constants';
import { renderWordCloudCanvas } from '@/core';
import type { RenderSettings, WordCloudFilterSettings } from '@/settings/types';
import type { WordCloudServices } from '@/services/types';
import { WordCloudFilterPanel } from '@/ui/components/filter-panel';
import { t } from '@/i18n';

export class NoteWordCloudView extends ItemView {
  private readonly services: WordCloudServices;
  private readonly renderNonce = { value: 0 };
  private selectedFilePath = '';
  private filters: WordCloudFilterSettings;
  private cloudCanvasEl: HTMLDivElement | null = null;
  private isEditPanelOpen = false;

  constructor(leaf: WorkspaceLeaf, services: WordCloudServices) {
    super(leaf);
    this.services = services;
    this.filters = services.getFilterSettings();
  }

  getViewType(): string {
    return VIEW_TYPE_NOTE_WORD_CLOUD;
  }

  getDisplayText(): string {
    return t('ui.views.note.displayText');
  }

  getIcon(): string {
    return 'file-text';
  }

  async onOpen(): Promise<void> {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('vault-word-cloud-view');

    this.filters = this.services.getFilterSettings();

    if (this.filters.scope.mode === 'active-file') {
      this.selectedFilePath = this.filters.scope.activeFilePath || this.services.getActiveFile()?.path || '';
    } else {
      this.selectedFilePath = this.services.getActiveFile()?.path || '';
    }

    const shellEl = contentEl.createDiv({ cls: 'word-cloud-view-shell' });
    const cloudCanvasEl = shellEl.createDiv({ cls: 'vault-word-cloud-canvas' });
    const editPanelEl = shellEl.createDiv({ cls: 'word-cloud-inline-edit-panel' });
    const editPanelContentEl = editPanelEl.createDiv({ cls: 'word-cloud-inline-edit-content' });

    this.cloudCanvasEl = cloudCanvasEl;

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

        if (this.filters.scope.mode === 'active-file') {
          this.selectedFilePath = this.filters.scope.activeFilePath || this.services.getActiveFile()?.path || '';
        }

        filterPanel.setFilters(this.filters);
        await this.renderCloud(cloudCanvasEl, setEditPanelOpen);
      },
    });

    setEditPanelOpen(false);

    this.registerDomEvent(editPanelEl, 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setEditPanelOpen(false);
      }
    });

    this.registerEvent(this.app.workspace.on('active-leaf-change', () => {
      const activeFile = this.services.getActiveFile();
      if (!activeFile) {
        return;
      }

      if (this.selectedFilePath === activeFile.path) {
        return;
      }

      this.selectedFilePath = activeFile.path;

      if (this.filters.scope.mode !== 'active-file') {
        void this.renderCloud(cloudCanvasEl, setEditPanelOpen);
        return;
      }

      void (async () => {
        this.filters = {
          ...this.filters,
          scope: {
            ...this.filters.scope,
            mode: 'active-file',
            activeFilePath: this.selectedFilePath,
          },
        };
        await this.services.updateFilterSettings(this.filters);
        this.filters = this.services.getFilterSettings();
        filterPanel.setFilters(this.filters);
        await this.renderCloud(cloudCanvasEl, setEditPanelOpen);
      })();
    }));

    await this.renderCloud(cloudCanvasEl, setEditPanelOpen);
  }

  async onClose(): Promise<void> {
    this.cloudCanvasEl = null;
  }

  async onResize(): Promise<void> {
    if (this.cloudCanvasEl) {
      await this.renderCloud(this.cloudCanvasEl);
    }
  }

  private resolveScopeFilePath(): string {
    if (this.selectedFilePath) {
      return this.selectedFilePath;
    }

    if (this.filters.scope.activeFilePath) {
      return this.filters.scope.activeFilePath;
    }

    return this.services.getActiveFile()?.path ?? '';
  }

  private findSelectedOpenFile(scopeFilePath = this.resolveScopeFilePath()): TFile | null {
    return this.services.getOpenMarkdownFiles().find((file) => file.path === scopeFilePath) ?? null;
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
      services: this.services,
      filters: this.filters,
      errorLogPrefix: 'Note word cloud',
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
      resolveScopeFilePath: () => this.resolveScopeFilePath(),
      resolveExtraContext: (scopeFilePath) => ({
        selectedFile: this.findSelectedOpenFile(scopeFilePath),
      }),
      getAriaLabel: ({ filters, extra }) => (
        filters?.scope.mode === 'active-file' && extra.selectedFile
          ? t('ui.views.note.aria.wordCloudForFile').replace('{file}', extra.selectedFile.basename)
          : t('ui.views.note.aria.wordCloudForSelectedFilters')
      ),
      getNoWordsMessage: ({ filters, scopeFilePath }) => (
        filters?.scope.mode === 'active-file' && !scopeFilePath
          ? t('ui.views.note.noWords.selectMarkdownNote')
          : t('ui.views.common.noWordsForFilters')
      ),
      getSearchOptions: ({ filters, scopeFilePath }) => ({
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
