import { setIcon } from 'obsidian';
import type { SourceScopeMode } from '../pipeline/types';
import type { WordCloudFilterSettings, WordCloudServices } from '../types';

const ALL_FREQUENCIES_MIN = 1;
const ALL_FREQUENCIES_MAX = 9999;

type RegisterDomEvent = (
  element: HTMLElement | Document | Window,
  type: string,
  callback: (event: Event) => void,
) => void;

type WordCloudFilterPanelOptions = {
  services: WordCloudServices;
  containerEl: HTMLDivElement;
  registerDomEvent: RegisterDomEvent;
  filters: WordCloudFilterSettings;
  onChange: (filters: WordCloudFilterSettings) => Promise<void> | void;
};

type FilterControlRefs = {
  summaryEl: HTMLDivElement;
  scopeSelectEl: HTMLSelectElement;
  includeTagSelectEl: HTMLSelectElement;
  modeSelectEl: HTMLSelectElement;
  includeTagsEl: HTMLDivElement;
};

export class WordCloudFilterPanel {
  private readonly services: WordCloudServices;
  private readonly containerEl: HTMLDivElement;
  private readonly registerDomEvent: RegisterDomEvent;
  private readonly onChange: (filters: WordCloudFilterSettings) => Promise<void> | void;
  private filters: WordCloudFilterSettings;
  private controls: FilterControlRefs | null = null;

  constructor(options: WordCloudFilterPanelOptions) {
    this.services = options.services;
    this.containerEl = options.containerEl;
    this.registerDomEvent = options.registerDomEvent;
    this.onChange = options.onChange;
    this.filters = sanitizeFilters(options.filters);

    this.containerEl.addClass('vault-word-cloud-controls-condensed');
    this.build();
    this.refreshControls();
  }

  setFilters(filters: WordCloudFilterSettings): void {
    this.filters = sanitizeFilters(filters);
    this.refreshControls();
  }

  private build(): void {
    const filterBarEl = this.containerEl.createDiv({ cls: 'vault-word-cloud-filter-bar' });
    const summaryEl = filterBarEl.createDiv({ cls: 'vault-word-cloud-filter-summary' });

    const resetButton = filterBarEl.createEl('button', {
      cls: 'vault-word-cloud-filter-reset',
    });
    resetButton.type = 'button';
    resetButton.setAttr('aria-label', 'Reset filters');
    resetButton.setAttr('data-tooltip-position', 'left');
    resetButton.setAttr('title', 'Reset filters');
    setIcon(resetButton, 'rotate-ccw');

    const sectionEl = this.containerEl.createDiv({ cls: 'vault-word-cloud-filter-section' });
    const headerEl = sectionEl.createDiv({ cls: 'vault-word-cloud-controls-header' });
    headerEl.createEl('span', { text: 'Filters', cls: 'vault-word-cloud-controls-title' });

    const gridEl = sectionEl.createDiv({ cls: 'vault-word-cloud-filter-grid' });

    const scopeEl = gridEl.createDiv({ cls: 'vault-word-cloud-tag-filter' });
    scopeEl.createEl('span', { text: 'Scope', cls: 'vault-word-cloud-tag-label' });
    const scopeSelectEl = scopeEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    scopeSelectEl.createEl('option', { value: 'vault', text: 'Entire vault' });
    scopeSelectEl.createEl('option', { value: 'active-file', text: 'Active note only' });

    const includeTagPickerEl = gridEl.createDiv({ cls: 'vault-word-cloud-tag-filter' });
    includeTagPickerEl.createEl('span', { text: 'Include tag', cls: 'vault-word-cloud-tag-label' });
    const includeTagSelectEl = includeTagPickerEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    includeTagSelectEl.createEl('option', { text: 'Add include tag...', value: '' });

    const modeEl = gridEl.createDiv({ cls: 'vault-word-cloud-match-mode' });
    modeEl.createEl('span', { text: 'Include match mode', cls: 'vault-word-cloud-tag-label' });
    const modeSelectEl = modeEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    modeSelectEl.createEl('option', { text: 'Any include tag', value: 'any' });
    modeSelectEl.createEl('option', { text: 'All include tags', value: 'all' });

    const includeTagsEl = sectionEl.createDiv({ cls: 'vault-word-cloud-applied-tags' });

    this.controls = {
      summaryEl,
      scopeSelectEl,
      includeTagSelectEl,
      modeSelectEl,
      includeTagsEl,
    };

    this.registerDomEvent(scopeSelectEl, 'change', () => {
      this.filters.scope.mode = (scopeSelectEl.value as SourceScopeMode) ?? 'vault';
      if (this.filters.scope.mode === 'active-file') {
        this.filters.scope.activeFilePath = this.services.getActiveFile()?.path ?? '';
      }
      void this.persist();
    });

    this.registerDomEvent(includeTagSelectEl, 'change', () => {
      const selectedTag = includeTagSelectEl.value;
      if (!selectedTag) {
        return;
      }

      if (!this.filters.includeTags.includes(selectedTag)) {
        this.filters.includeTags.push(selectedTag);
      }
      includeTagSelectEl.value = '';
      void this.persist();
    });

    this.registerDomEvent(modeSelectEl, 'change', () => {
      this.filters.tagMatchMode = modeSelectEl.value === 'all' ? 'all' : 'any';
      void this.persist();
    });

    this.registerDomEvent(resetButton, 'click', () => {
      this.filters = sanitizeFilters({
        ...this.filters,
        scope: {
          mode: 'vault',
          activeFilePath: '',
          folderPaths: [],
        },
        includeTags: [],
        tagMatchMode: 'any',
      });
      void this.persist();
    });
  }

  private refreshControls(): void {
    if (!this.controls) {
      return;
    }

    const {
      summaryEl,
      scopeSelectEl,
      includeTagSelectEl,
      modeSelectEl,
      includeTagsEl,
    } = this.controls;

    scopeSelectEl.value = this.filters.scope.mode;
    modeSelectEl.value = this.filters.tagMatchMode;

    this.updateTagPickerOptions(includeTagSelectEl);
    this.renderAppliedTagChips(includeTagsEl);

    modeSelectEl.disabled = this.filters.includeTags.length <= 1;
    summaryEl.setText(this.buildFilterSummary());
  }

  private updateTagPickerOptions(selectEl: HTMLSelectElement): void {
    const tags = this.services.getAvailableTags();
    const includeSet = new Set(this.filters.includeTags);

    const previous = selectEl.value;
    selectEl.empty();
    selectEl.createEl('option', { text: 'Add include tag...', value: '' });

    for (const tag of tags) {
      const option = selectEl.createEl('option', { text: tag, value: tag });
      option.disabled = includeSet.has(tag);
    }

    selectEl.value = previous && selectEl.querySelector(`option[value="${CSS.escape(previous)}"]`) ? previous : '';
  }

  private renderAppliedTagChips(chipsEl: HTMLDivElement): void {
    chipsEl.empty();

    if (this.filters.includeTags.length === 0) {
      chipsEl.createSpan({
        cls: 'vault-word-cloud-chip-empty',
        text: 'No include tags applied.',
      });
      return;
    }

    for (const tag of this.filters.includeTags) {
      const chipEl = chipsEl.createDiv({ cls: 'vault-word-cloud-chip' });
      chipEl.createSpan({ cls: 'vault-word-cloud-chip-text', text: `+ ${tag}` });

      const removeButton = chipEl.createEl('button', {
        cls: 'vault-word-cloud-chip-remove',
        text: 'x',
      });
      removeButton.type = 'button';
      removeButton.setAttr('aria-label', `Remove ${tag} include filter`);

      this.registerDomEvent(removeButton, 'click', () => {
        this.filters.includeTags = this.filters.includeTags.filter((value) => value !== tag);
        void this.persist();
      });
    }
  }

  private buildFilterSummary(): string {
    const parts: string[] = [];
    parts.push(this.filters.scope.mode === 'vault' ? 'Scope: vault' : 'Scope: active note');

    if (this.filters.includeTags.length > 0) {
      parts.push(`Include: ${this.filters.includeTags.length} tag(s)`);
    }

    parts.push('Frequency: all');
    return parts.join(' | ');
  }

  private async persist(): Promise<void> {
    this.filters = sanitizeFilters(this.filters);
    await this.onChange(cloneFilters(this.filters));
  }
}

function sanitizeFilters(filters: WordCloudFilterSettings): WordCloudFilterSettings {
  const mode: SourceScopeMode = filters.scope.mode === 'active-file' ? 'active-file' : 'vault';

  return {
    scope: {
      mode,
      activeFilePath: filters.scope.activeFilePath,
      folderPaths: [],
    },
    includeTags: [...filters.includeTags],
    excludeTags: [],
    tagMatchMode: filters.tagMatchMode,
    frontmatterRules: [],
    frequency: {
      minCount: ALL_FREQUENCIES_MIN,
      maxCount: ALL_FREQUENCIES_MAX,
    },
  };
}

function cloneFilters(filters: WordCloudFilterSettings): WordCloudFilterSettings {
  return {
    scope: {
      mode: filters.scope.mode,
      activeFilePath: filters.scope.activeFilePath,
      folderPaths: [...filters.scope.folderPaths],
    },
    includeTags: [...filters.includeTags],
    excludeTags: [...filters.excludeTags],
    tagMatchMode: filters.tagMatchMode,
    frontmatterRules: filters.frontmatterRules.map((rule) => ({ ...rule })),
    frequency: {
      minCount: filters.frequency.minCount,
      maxCount: filters.frequency.maxCount,
    },
  };
}
