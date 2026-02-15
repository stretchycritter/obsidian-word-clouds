import { ItemView, Notice, WorkspaceLeaf } from 'obsidian';
import type { FrontmatterOperator, FrontmatterRule, SourceScopeMode } from '../pipeline/types';
import { VIEW_TYPE_VAULT_WORD_CLOUD } from '../constants';
import type { WordCloudFilterSettings, WordCloudServices } from '../types';

const FRONTMATTER_OPERATORS: Array<{ value: FrontmatterOperator; label: string }> = [
  { value: 'equals', label: 'Equals' },
  { value: 'not-equals', label: 'Not equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'gt', label: 'Greater than' },
  { value: 'gte', label: 'Greater or equal' },
  { value: 'lt', label: 'Less than' },
  { value: 'lte', label: 'Less or equal' },
  { value: 'exists', label: 'Exists' },
  { value: 'not-exists', label: 'Not exists' },
];

const RULES_WITHOUT_VALUE = new Set<FrontmatterOperator>(['exists', 'not-exists']);

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
    const summaryEl = controlsEl.createDiv({ cls: 'vault-word-cloud-filter-summary' });

    const basicSectionEl = controlsEl.createDiv({ cls: 'vault-word-cloud-filter-section' });
    const basicHeaderEl = basicSectionEl.createDiv({ cls: 'vault-word-cloud-controls-header' });
    basicHeaderEl.createEl('span', { text: 'Basic filters', cls: 'vault-word-cloud-controls-title' });
    basicHeaderEl.createEl('span', {
      text: 'Best for everyday use',
      cls: 'vault-word-cloud-controls-summary',
    });
    const basicGridEl = basicSectionEl.createDiv({ cls: 'vault-word-cloud-filter-grid' });

    const scopeEl = basicGridEl.createDiv({ cls: 'vault-word-cloud-tag-filter' });
    scopeEl.createEl('span', { text: 'Scope', cls: 'vault-word-cloud-tag-label' });
    const scopeSelectEl = scopeEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    scopeSelectEl.createEl('option', { value: 'vault', text: 'Entire vault' });
    scopeSelectEl.createEl('option', { value: 'active-file', text: 'Active note only' });
    scopeSelectEl.createEl('option', { value: 'folder', text: 'Selected folder(s)' });
    scopeSelectEl.value = this.filters.scope.mode;

    const minFrequencyEl = basicGridEl.createDiv({ cls: 'vault-word-cloud-tag-filter' });
    minFrequencyEl.createEl('span', { text: 'Minimum frequency', cls: 'vault-word-cloud-tag-label' });
    const minFrequencyInputEl = minFrequencyEl.createEl('input', { cls: 'vault-word-cloud-mode-select', type: 'number' });
    minFrequencyInputEl.min = '1';
    minFrequencyInputEl.max = '9999';
    minFrequencyInputEl.value = String(this.filters.frequency.minCount);

    const includeTagPickerEl = basicGridEl.createDiv({ cls: 'vault-word-cloud-tag-filter' });
    includeTagPickerEl.createEl('span', { text: 'Include tag', cls: 'vault-word-cloud-tag-label' });
    const includeTagSelectEl = includeTagPickerEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    includeTagSelectEl.createEl('option', { text: 'Add include tag...', value: '' });

    const excludeTagPickerEl = basicGridEl.createDiv({ cls: 'vault-word-cloud-tag-filter' });
    excludeTagPickerEl.createEl('span', { text: 'Exclude tag', cls: 'vault-word-cloud-tag-label' });
    const excludeTagSelectEl = excludeTagPickerEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    excludeTagSelectEl.createEl('option', { text: 'Add exclude tag...', value: '' });

    const modeEl = basicGridEl.createDiv({ cls: 'vault-word-cloud-match-mode' });
    modeEl.createEl('span', { text: 'Include match mode', cls: 'vault-word-cloud-tag-label' });
    const modeSelectEl = modeEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    modeSelectEl.createEl('option', { text: 'Any include tag', value: 'any' });
    modeSelectEl.createEl('option', { text: 'All include tags', value: 'all' });
    modeSelectEl.value = this.filters.tagMatchMode;

    const actionEl = basicGridEl.createDiv({ cls: 'vault-word-cloud-match-mode' });
    actionEl.createEl('span', { text: 'Actions', cls: 'vault-word-cloud-tag-label' });
    const clearFiltersButton = actionEl.createEl('button', {
      text: 'Clear all filters',
      cls: 'vault-word-cloud-refresh',
    });
    clearFiltersButton.type = 'button';

    const includeTagsEl = basicSectionEl.createDiv({ cls: 'vault-word-cloud-applied-tags' });
    const excludeTagsEl = basicSectionEl.createDiv({ cls: 'vault-word-cloud-applied-tags' });

    const advancedDetailsEl = controlsEl.createEl('details', { cls: 'vault-word-cloud-advanced-details' });
    const advancedSummaryEl = advancedDetailsEl.createEl('summary', { cls: 'vault-word-cloud-advanced-summary' });
    advancedSummaryEl.setText('Advanced filters');
    const advancedBodyEl = advancedDetailsEl.createDiv({ cls: 'vault-word-cloud-filter-section' });

    const advancedIntroEl = advancedBodyEl.createDiv({ cls: 'vault-word-cloud-controls-summary' });
    advancedIntroEl.setText('Use these only if you need tighter control.');

    const advancedGridEl = advancedBodyEl.createDiv({ cls: 'vault-word-cloud-filter-grid' });

    const folderPickerEl = advancedGridEl.createDiv({ cls: 'vault-word-cloud-tag-filter' });
    folderPickerEl.createEl('span', { text: 'Add folder', cls: 'vault-word-cloud-tag-label' });
    const folderSelectEl = folderPickerEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
    folderSelectEl.createEl('option', { text: 'Add folder...', value: '' });

    const maxFrequencyEl = advancedGridEl.createDiv({ cls: 'vault-word-cloud-tag-filter' });
    maxFrequencyEl.createEl('span', { text: 'Maximum frequency', cls: 'vault-word-cloud-tag-label' });
    const maxFrequencyInputEl = maxFrequencyEl.createEl('input', { cls: 'vault-word-cloud-mode-select', type: 'number' });
    maxFrequencyInputEl.min = '1';
    maxFrequencyInputEl.max = '9999';
    maxFrequencyInputEl.value = String(this.filters.frequency.maxCount);

    const folderChipsEl = advancedBodyEl.createDiv({ cls: 'vault-word-cloud-applied-tags' });

    const frontmatterEl = advancedBodyEl.createDiv({ cls: 'vault-word-cloud-frontmatter' });
    const frontmatterHeaderEl = frontmatterEl.createDiv({ cls: 'vault-word-cloud-controls-header' });
    frontmatterHeaderEl.createEl('span', { text: 'Frontmatter rules', cls: 'vault-word-cloud-controls-title' });
    const addRuleButton = frontmatterHeaderEl.createEl('button', { text: 'Add rule', cls: 'vault-word-cloud-refresh' });
    addRuleButton.type = 'button';
    const rulesListEl = frontmatterEl.createDiv({ cls: 'vault-word-cloud-frontmatter-list' });

    const canvasEl = contentEl.createDiv({ cls: 'vault-word-cloud-canvas' });

    const refreshControls = (): void => {
      this.updateFolderPickerOptions(folderSelectEl);
      this.updateTagPickerOptions(includeTagSelectEl, 'include');
      this.updateTagPickerOptions(excludeTagSelectEl, 'exclude');
      this.renderSelectedFolders(folderChipsEl, folderSelectEl, canvasEl);
      this.renderAppliedTagChips(includeTagsEl, includeTagSelectEl, 'include', canvasEl);
      this.renderAppliedTagChips(excludeTagsEl, excludeTagSelectEl, 'exclude', canvasEl);
      this.renderFrontmatterRules(rulesListEl, canvasEl);
      const showFolderScope = this.filters.scope.mode === 'folder';
      folderPickerEl.toggleClass('is-hidden', !showFolderScope);
      folderChipsEl.toggleClass('is-hidden', !showFolderScope);
      modeSelectEl.disabled = this.filters.includeTags.length <= 1;
      summaryEl.setText(this.buildFilterSummary());
    };

    refreshControls();

    this.registerDomEvent(scopeSelectEl, 'change', () => {
      this.filters.scope.mode = (scopeSelectEl.value as SourceScopeMode) ?? 'vault';
      if (this.filters.scope.mode === 'active-file') {
        this.filters.scope.activeFilePath = this.services.getActiveFile()?.path ?? '';
      }
      void this.persistFiltersAndRender(canvasEl, refreshControls);
    });

    this.registerDomEvent(folderSelectEl, 'change', () => {
      const selectedFolder = folderSelectEl.value;
      if (selectedFolder && !this.filters.scope.folderPaths.includes(selectedFolder)) {
        this.filters.scope.folderPaths.push(selectedFolder);
      }
      folderSelectEl.value = '';
      void this.persistFiltersAndRender(canvasEl, refreshControls);
    });

    this.registerDomEvent(includeTagSelectEl, 'change', () => {
      const selectedTag = includeTagSelectEl.value;
      if (!selectedTag) {
        return;
      }

      if (!this.filters.includeTags.includes(selectedTag)) {
        this.filters.includeTags.push(selectedTag);
      }
      this.filters.excludeTags = this.filters.excludeTags.filter((tag) => tag !== selectedTag);
      includeTagSelectEl.value = '';
      void this.persistFiltersAndRender(canvasEl, refreshControls);
    });

    this.registerDomEvent(excludeTagSelectEl, 'change', () => {
      const selectedTag = excludeTagSelectEl.value;
      if (!selectedTag) {
        return;
      }

      if (!this.filters.excludeTags.includes(selectedTag)) {
        this.filters.excludeTags.push(selectedTag);
      }
      this.filters.includeTags = this.filters.includeTags.filter((tag) => tag !== selectedTag);
      excludeTagSelectEl.value = '';
      void this.persistFiltersAndRender(canvasEl, refreshControls);
    });

    this.registerDomEvent(modeSelectEl, 'change', () => {
      this.filters.tagMatchMode = modeSelectEl.value === 'all' ? 'all' : 'any';
      void this.persistFiltersAndRender(canvasEl, refreshControls);
    });

    this.registerDomEvent(addRuleButton, 'click', () => {
      this.filters.frontmatterRules = [
        ...this.filters.frontmatterRules,
        { key: '', operator: 'equals', value: '' },
      ];
      void this.persistFiltersAndRender(canvasEl, refreshControls);
    });

    this.registerDomEvent(minFrequencyInputEl, 'change', () => {
      this.filters.frequency.minCount = clampNumber(minFrequencyInputEl.value, 1, 9999, 1);
      minFrequencyInputEl.value = String(this.filters.frequency.minCount);
      void this.persistFiltersAndRender(canvasEl, refreshControls);
    });

    this.registerDomEvent(maxFrequencyInputEl, 'change', () => {
      this.filters.frequency.maxCount = clampNumber(maxFrequencyInputEl.value, 1, 9999, 9999);
      maxFrequencyInputEl.value = String(this.filters.frequency.maxCount);
      void this.persistFiltersAndRender(canvasEl, refreshControls);
    });

    this.registerDomEvent(clearFiltersButton, 'click', () => {
      this.filters = {
        ...this.filters,
        scope: {
          mode: 'vault',
          activeFilePath: '',
          folderPaths: [],
        },
        includeTags: [],
        excludeTags: [],
        tagMatchMode: 'any',
        frontmatterRules: [],
        frequency: {
          minCount: 1,
          maxCount: 9999,
        },
      };
      scopeSelectEl.value = this.filters.scope.mode;
      minFrequencyInputEl.value = String(this.filters.frequency.minCount);
      maxFrequencyInputEl.value = String(this.filters.frequency.maxCount);
      void this.persistFiltersAndRender(canvasEl, refreshControls);
    });

    await this.renderCloud(canvasEl);
  }

  async onResize(): Promise<void> {
    const canvasEl = this.contentEl.querySelector('.vault-word-cloud-canvas');
    if (canvasEl instanceof HTMLDivElement) {
      await this.renderCloud(canvasEl);
    }
  }

  private updateTagPickerOptions(selectEl: HTMLSelectElement, mode: 'include' | 'exclude'): void {
    const tags = this.services.getAvailableTags();
    const includeSet = new Set(this.filters.includeTags);
    const excludeSet = new Set(this.filters.excludeTags);

    const previous = selectEl.value;
    selectEl.empty();
    selectEl.createEl('option', { text: mode === 'include' ? 'Add include tag...' : 'Add exclude tag...', value: '' });

    for (const tag of tags) {
      const option = selectEl.createEl('option', { text: tag, value: tag });
      if (mode === 'include') {
        option.disabled = includeSet.has(tag) || excludeSet.has(tag);
      } else {
        option.disabled = excludeSet.has(tag) || includeSet.has(tag);
      }
    }

    selectEl.value = previous && selectEl.querySelector(`option[value="${CSS.escape(previous)}"]`) ? previous : '';
  }

  private updateFolderPickerOptions(selectEl: HTMLSelectElement): void {
    const folders = this.services.getAvailableFolders();
    const selectedSet = new Set(this.filters.scope.folderPaths);

    selectEl.empty();
    selectEl.createEl('option', { text: 'Add folder...', value: '' });

    for (const folder of folders) {
      const option = selectEl.createEl('option', { text: folder, value: folder });
      option.disabled = selectedSet.has(folder);
    }

    selectEl.value = '';
  }

  private renderSelectedFolders(
    chipsEl: HTMLDivElement,
    folderSelectEl: HTMLSelectElement,
    canvasEl: HTMLDivElement,
  ): void {
    chipsEl.empty();

    if (this.filters.scope.folderPaths.length === 0) {
      chipsEl.createSpan({ cls: 'vault-word-cloud-chip-empty', text: 'No folders selected.' });
      return;
    }

    for (const folder of this.filters.scope.folderPaths) {
      const chipEl = chipsEl.createDiv({ cls: 'vault-word-cloud-chip' });
      chipEl.createSpan({ cls: 'vault-word-cloud-chip-text', text: folder });

      const removeButton = chipEl.createEl('button', {
        cls: 'vault-word-cloud-chip-remove',
        text: 'x',
      });
      removeButton.type = 'button';
      removeButton.setAttr('aria-label', `Remove ${folder} folder filter`);

      this.registerDomEvent(removeButton, 'click', () => {
        this.filters.scope.folderPaths = this.filters.scope.folderPaths.filter((value) => value !== folder);
        this.updateFolderPickerOptions(folderSelectEl);
        this.renderSelectedFolders(chipsEl, folderSelectEl, canvasEl);
        void this.persistFiltersAndRender(canvasEl);
      });
    }
  }

  private renderAppliedTagChips(
    chipsEl: HTMLDivElement,
    tagSelectEl: HTMLSelectElement,
    mode: 'include' | 'exclude',
    canvasEl: HTMLDivElement,
  ): void {
    chipsEl.empty();

    const selectedTags = mode === 'include' ? this.filters.includeTags : this.filters.excludeTags;

    if (selectedTags.length === 0) {
      chipsEl.createSpan({
        cls: 'vault-word-cloud-chip-empty',
        text: mode === 'include' ? 'No include tags applied.' : 'No exclude tags applied.',
      });
      return;
    }

    for (const tag of selectedTags) {
      const chipEl = chipsEl.createDiv({ cls: 'vault-word-cloud-chip' });
      chipEl.createSpan({ cls: 'vault-word-cloud-chip-text', text: `${mode === 'include' ? '+' : '-'} ${tag}` });

      const removeButton = chipEl.createEl('button', {
        cls: 'vault-word-cloud-chip-remove',
        text: 'x',
      });
      removeButton.type = 'button';
      removeButton.setAttr('aria-label', `Remove ${tag} ${mode} filter`);

      this.registerDomEvent(removeButton, 'click', () => {
        if (mode === 'include') {
          this.filters.includeTags = this.filters.includeTags.filter((value) => value !== tag);
        } else {
          this.filters.excludeTags = this.filters.excludeTags.filter((value) => value !== tag);
        }

        this.updateTagPickerOptions(tagSelectEl, mode);
        this.renderAppliedTagChips(chipsEl, tagSelectEl, mode, canvasEl);
        void this.persistFiltersAndRender(canvasEl);
      });
    }
  }

  private renderFrontmatterRules(rulesListEl: HTMLDivElement, canvasEl: HTMLDivElement): void {
    rulesListEl.empty();

    if (this.filters.frontmatterRules.length === 0) {
      rulesListEl.createSpan({ cls: 'vault-word-cloud-chip-empty', text: 'No frontmatter rules.' });
      return;
    }

    this.filters.frontmatterRules.forEach((rule, index) => {
      const rowEl = rulesListEl.createDiv({ cls: 'vault-word-cloud-frontmatter-row' });

      const keyInputEl = rowEl.createEl('input', {
        cls: 'vault-word-cloud-mode-select',
        type: 'text',
      });
      keyInputEl.placeholder = 'key (example: status)';
      keyInputEl.value = rule.key;

      const operatorSelectEl = rowEl.createEl('select', { cls: 'vault-word-cloud-mode-select' });
      for (const option of FRONTMATTER_OPERATORS) {
        operatorSelectEl.createEl('option', { value: option.value, text: option.label });
      }
      operatorSelectEl.value = rule.operator;

      const valueInputEl = rowEl.createEl('input', {
        cls: 'vault-word-cloud-mode-select',
        type: 'text',
      });
      valueInputEl.placeholder = 'value';
      valueInputEl.value = rule.value ?? '';
      valueInputEl.toggleClass('is-hidden', RULES_WITHOUT_VALUE.has(rule.operator));

      const removeButton = rowEl.createEl('button', {
        cls: 'vault-word-cloud-chip-remove',
        text: 'x',
      });
      removeButton.type = 'button';
      removeButton.setAttr('aria-label', `Remove frontmatter rule ${index + 1}`);

      const updateRule = (patch: Partial<FrontmatterRule>): void => {
        this.filters.frontmatterRules[index] = {
          ...this.filters.frontmatterRules[index],
          ...patch,
        };
        void this.persistFiltersAndRender(canvasEl);
      };

      this.registerDomEvent(keyInputEl, 'change', () => {
        updateRule({ key: keyInputEl.value.trim() });
      });

      this.registerDomEvent(operatorSelectEl, 'change', () => {
        const nextOperator = operatorSelectEl.value as FrontmatterOperator;
        const requiresValue = !RULES_WITHOUT_VALUE.has(nextOperator);
        valueInputEl.toggleClass('is-hidden', !requiresValue);
        updateRule({
          operator: nextOperator,
          value: requiresValue ? valueInputEl.value.trim() : '',
        });
      });

      this.registerDomEvent(valueInputEl, 'change', () => {
        updateRule({ value: valueInputEl.value.trim() });
      });

      this.registerDomEvent(removeButton, 'click', () => {
        this.filters.frontmatterRules = this.filters.frontmatterRules.filter((_, ruleIndex) => ruleIndex !== index);
        this.renderFrontmatterRules(rulesListEl, canvasEl);
        void this.persistFiltersAndRender(canvasEl);
      });
    });
  }

  private async persistFiltersAndRender(canvasEl: HTMLDivElement, afterPersist?: () => void): Promise<void> {
    const min = Math.min(this.filters.frequency.minCount, this.filters.frequency.maxCount);
    const max = Math.max(this.filters.frequency.minCount, this.filters.frequency.maxCount);
    this.filters.frequency.minCount = min;
    this.filters.frequency.maxCount = max;

    await this.services.updateFilterSettings(this.filters);
    this.filters = this.services.getFilterSettings();
    afterPersist?.();
    await this.renderCloud(canvasEl);
  }

  private buildFilterSummary(): string {
    const parts: string[] = [];
    parts.push(this.filters.scope.mode === 'vault'
      ? 'Scope: vault'
      : this.filters.scope.mode === 'active-file'
        ? 'Scope: active note'
        : `Scope: ${this.filters.scope.folderPaths.length || 0} folder(s)`);

    if (this.filters.includeTags.length > 0) {
      parts.push(`Include: ${this.filters.includeTags.length} tag(s)`);
    }
    if (this.filters.excludeTags.length > 0) {
      parts.push(`Exclude: ${this.filters.excludeTags.length} tag(s)`);
    }
    if (this.filters.frontmatterRules.length > 0) {
      parts.push(`Frontmatter: ${this.filters.frontmatterRules.length} rule(s)`);
    }

    parts.push(`Frequency: ${this.filters.frequency.minCount}-${this.filters.frequency.maxCount}`);
    return parts.join(' | ');
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

function clampNumber(rawValue: string, min: number, max: number, fallback: number): number {
  const parsed = Number.parseInt(rawValue, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}
