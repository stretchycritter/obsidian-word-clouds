import { ItemView, type TFile, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_NOTE_WORD_CLOUD } from '@/ui/constants';
import { drawFrequencyChart } from '@/ui/renderers/frequency-chart-renderer';
import type { RenderSettings, WordCloudFilterSettings } from '@/settings/types';
import type { WordCloudServices } from '@/services/types';
import type { WeightedWord } from '@/domain/word-cloud';
import { WordCloudFilterPanel } from '@/ui/components/filter-panel';
import {
  renderWordCloudCanvas,
  resolveSelectedFileByPath,
} from '@/ui/renderers/word-cloud-canvas-renderer';

type NoteViewTab = 'cloud' | 'frequency';

export class NoteWordCloudView extends ItemView {
  private readonly services: WordCloudServices;
  private readonly renderNonce = { value: 0 };
  private selectedFilePath = '';
  private activeTab: NoteViewTab = 'cloud';
  private latestWords: WeightedWord[] = [];
  private latestContextLabel = 'current filters';
  private frequencyRendered = false;
  private cloudCanvasEl: HTMLDivElement | null = null;
  private frequencyCanvasEl: HTMLDivElement | null = null;
  private cloudTabButtonEl: HTMLButtonElement | null = null;
  private frequencyTabButtonEl: HTMLButtonElement | null = null;
  private filters: WordCloudFilterSettings;

  constructor(leaf: WorkspaceLeaf, services: WordCloudServices) {
    super(leaf);
    this.services = services;
    this.filters = services.getFilterSettings();
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

    this.filters = this.services.getFilterSettings();

    const topEl = contentEl.createDiv({ cls: 'vault-word-cloud-top' });
    const headerEl = topEl.createDiv({ cls: 'vault-word-cloud-header' });
    headerEl.createEl('h2', { text: 'Note word clouds', cls: 'vault-word-cloud-title' });

    const controlsEl = topEl.createDiv({ cls: 'vault-word-cloud-controls' });

    const noteControlsEl = controlsEl.createDiv({ cls: 'vault-word-cloud-filter-section' });
    const noteHeaderEl = noteControlsEl.createDiv({ cls: 'vault-word-cloud-controls-header' });
    noteHeaderEl.createEl('span', { text: 'Note picker', cls: 'vault-word-cloud-controls-title' });
    noteHeaderEl.createEl('span', {
      text: 'Used when scope is Active note only',
      cls: 'vault-word-cloud-controls-summary',
    });

    const noteGridEl = noteControlsEl.createDiv({ cls: 'vault-word-cloud-filter-grid' });
    const fileFilterEl = noteGridEl.createDiv({ cls: 'vault-word-cloud-tag-filter' });
    const fileLabelEl = fileFilterEl.createEl('label', { text: 'Open note', cls: 'vault-word-cloud-tag-label' });
    const fileSelectEl = fileFilterEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    fileSelectEl.id = 'vault-word-cloud-note-select';
    fileLabelEl.setAttr('for', fileSelectEl.id);
    fileSelectEl.setAttr('aria-label', 'Choose an open note');

    const noteActionsEl = noteGridEl.createDiv({ cls: 'vault-word-cloud-match-mode' });
    noteActionsEl.createEl('span', { text: 'Actions', cls: 'vault-word-cloud-tag-label' });

    const activeButton = noteActionsEl.createEl('button', {
      text: 'Use active note',
      cls: 'vault-word-cloud-refresh',
    });
    activeButton.type = 'button';
    activeButton.setAttr('aria-label', 'Use active note');

    const refreshButton = noteActionsEl.createEl('button', {
      text: 'Refresh',
      cls: 'vault-word-cloud-refresh',
    });
    refreshButton.type = 'button';
    refreshButton.setAttr('aria-label', 'Refresh note insights');
    const registerElementEvent = (
      element: HTMLElement,
      type: keyof HTMLElementEventMap,
      callback: (event: Event) => void,
    ): void => {
      this.registerDomEvent(element, type, callback as EventListener);
    };

    let filterPanel: WordCloudFilterPanel;
    const persistFiltersAndRender = async (nextFilters: WordCloudFilterSettings): Promise<void> => {
      this.filters = nextFilters;
      await this.services.updateFilterSettings(this.filters);
      this.filters = this.services.getFilterSettings();
      filterPanel.setFilters(this.filters);
      await this.renderCloud(cloudCanvasEl);
    };

    filterPanel = new WordCloudFilterPanel({
      services: this.services,
      containerEl: controlsEl,
      registerDomEvent: registerElementEvent,
      filters: this.filters,
      onChange: persistFiltersAndRender,
    });

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
      if (this.filters.scope.mode !== 'active-file') {
        void this.renderCloud(cloudCanvasEl);
        return;
      }

      void persistFiltersAndRender({
        ...this.filters,
        scope: {
          ...this.filters.scope,
          mode: 'active-file',
          activeFilePath: this.selectedFilePath,
        },
      });
    });

    this.registerDomEvent(activeButton, 'click', () => {
      const activeFile = this.services.getActiveFile();
      if (activeFile) {
        this.selectedFilePath = activeFile.path;
        this.updateOpenFileOptions(fileSelectEl);
        fileSelectEl.value = this.selectedFilePath;
      }

      if (this.filters.scope.mode !== 'active-file') {
        void this.renderCloud(cloudCanvasEl);
        return;
      }

      void persistFiltersAndRender({
        ...this.filters,
        scope: {
          ...this.filters.scope,
          mode: 'active-file',
          activeFilePath: this.selectedFilePath,
        },
      });
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

        if (this.filters.scope.mode === 'active-file') {
          void persistFiltersAndRender({
            ...this.filters,
            scope: {
              ...this.filters.scope,
              mode: 'active-file',
              activeFilePath: this.selectedFilePath,
            },
          });
          return;
        }

        void this.renderCloud(cloudCanvasEl);
      }
    }));

    await this.renderCloud(cloudCanvasEl);
  }

  async onClose(): Promise<void> {
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
    return resolveSelectedFileByPath(this.services.getOpenMarkdownFiles(), scopeFilePath);
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
      errorLogPrefix: 'Note word cloud',
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
      resolveScopeFilePath: () => this.resolveScopeFilePath(),
      resolveExtraContext: (scopeFilePath) => ({
        selectedFile: this.findSelectedOpenFile(scopeFilePath),
      }),
      getAriaLabel: ({ filters, extra }) => (
        filters?.scope.mode === 'active-file' && extra.selectedFile
          ? `Word cloud for ${extra.selectedFile.basename}`
          : 'Word cloud for selected filters'
      ),
      getNoWordsMessage: ({ filters, scopeFilePath }) => (
        filters?.scope.mode === 'active-file' && !scopeFilePath
          ? 'Open a markdown note and select it to view a note-specific word cloud.'
          : 'No words found for the selected filters.'
      ),
      getSearchOptions: ({ filters, scopeFilePath }) => ({
        includeTags: filters?.includeTags ?? [],
        excludeTags: filters?.excludeTags ?? [],
        tagMatchMode: filters?.tagMatchMode ?? 'any',
        filePath: filters?.scope.mode === 'active-file'
          ? scopeFilePath
          : undefined,
      }),
      onWordsResolved: (words, { filters, extra }) => {
        this.latestWords = words;
        this.latestContextLabel = filters?.scope.mode === 'active-file' && extra.selectedFile
          ? extra.selectedFile.basename
          : 'selected filters';
        this.frequencyRendered = false;
      },
      onAfterRender: () => {
        if (this.activeTab === 'frequency') {
          this.renderFrequencyChart(true);
        }
      },
      onAfterEmpty: () => {
        if (this.activeTab === 'frequency') {
          this.renderFrequencyChart(true);
        }
      },
      getRenderSettingsOverride: () => renderSettingsOverride,
      onRefresh: () => this.renderCloud(containerEl, renderSettingsOverride),
    });
  }

  private renderFrequencyChart(force = false): void {
    if (!this.frequencyCanvasEl || (!force && this.frequencyRendered)) {
      return;
    }

    this.frequencyCanvasEl.empty();

    if (this.latestWords.length === 0) {
      this.frequencyCanvasEl.createDiv({
        cls: 'vault-word-cloud-state',
        text: 'No words found for the selected filters.',
      });
      this.frequencyRendered = true;
      return;
    }

    drawFrequencyChart({
      containerEl: this.frequencyCanvasEl,
      words: this.latestWords,
      ariaLabel: `Word frequency chart for ${this.latestContextLabel}`,
    });

    this.frequencyRendered = true;
  }
}
