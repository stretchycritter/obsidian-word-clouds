import { App, ButtonComponent, Modal, Notice, Setting } from 'obsidian';
import type { WordCloudServices } from '@/services/types';
import type { FrontmatterRule, FrontmatterOperator } from '@/settings/types';
import { normalizeTag } from '@/utils/utils';

export type EmbedScope = 'file' | 'vault' | 'folder';
export type EmbedSize = 'small' | 'medium' | 'large';
export type EmbedTagMatchMode = 'any' | 'all';
type EmbedSettingsTab = 'filters' | 'appearance' | 'advanced';

export type EmbedWizardState = {
  cloudId: string;
  scope: EmbedScope;
  size: EmbedSize;
  specificFilePath: string;
  includeTagsRaw: string;
  excludeTagsRaw: string;
  tagMatchMode: EmbedTagMatchMode;
  folderPathsRaw: string;
  frontmatterRulesRaw: string;
  minCountRaw: string;
  maxCountRaw: string;
};

type EmbedWordCloudModalOptions = {
  title?: string;
  description?: string;
  submitButtonText?: string;
  initialState?: Partial<EmbedWizardState>;
};

const DEFAULT_STATE: EmbedWizardState = {
  cloudId: '',
  scope: 'file',
  size: 'medium',
  specificFilePath: '',
  includeTagsRaw: '',
  excludeTagsRaw: '',
  tagMatchMode: 'any',
  folderPathsRaw: '',
  frontmatterRulesRaw: '',
  minCountRaw: '',
  maxCountRaw: '',
};

const FRONTMATTER_OPERATORS: FrontmatterOperator[] = [
  'equals',
  'not-equals',
  'contains',
  'gt',
  'gte',
  'lt',
  'lte',
  'exists',
  'not-exists',
];

export class EmbedWordCloudModal extends Modal {
  private readonly services: WordCloudServices;
  private readonly onInsert: (embedBlock: string) => boolean | Promise<boolean>;
  private readonly state: EmbedWizardState;
  private readonly title: string;
  private readonly description: string;
  private readonly submitButtonText: string;

  private tabsEl!: HTMLDivElement;
  private filtersTabButtonEl!: HTMLButtonElement;
  private appearanceTabButtonEl!: HTMLButtonElement;
  private advancedTabButtonEl!: HTMLButtonElement;
  private filtersPanelEl!: HTMLDivElement;
  private appearancePanelEl!: HTMLDivElement;
  private advancedPanelEl!: HTMLDivElement;
  private scopeWrapperEl!: HTMLDivElement;
  private specificFileWrapperEl!: HTMLDivElement;
  private sizeWrapperEl!: HTMLDivElement;
  private includeTagsWrapperEl!: HTMLDivElement;
  private matchModeWrapperEl!: HTMLDivElement;

  constructor(
    app: App,
    services: WordCloudServices,
    onInsert: (embedBlock: string) => boolean | Promise<boolean>,
    options: EmbedWordCloudModalOptions = {},
  ) {
    super(app);
    this.services = services;
    this.onInsert = onInsert;
    this.title = options.title ?? 'Embed word cloud in document';
    this.description = options.description ?? 'Configure options, then insert a word cloud embed at your cursor.';
    this.submitButtonText = options.submitButtonText ?? 'Apply';

    const initialState = options.initialState ?? {};
    this.state = {
      ...DEFAULT_STATE,
      ...initialState,
    };
    if (!this.state.cloudId) {
      this.state.cloudId = createEmbedCloudId();
    }
    if (this.state.scope === 'folder') {
      this.state.scope = 'vault';
    }
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('word-cloud-embed-wizard');

    contentEl.createEl('h2', { text: this.title });
    contentEl.createEl('p', {
      cls: 'word-cloud-embed-wizard-description',
      text: this.description,
    });

    this.scopeWrapperEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });
    this.specificFileWrapperEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });

    new Setting(this.scopeWrapperEl)
      .setName('Scope')
      .setDesc('Choose whether this cloud uses the note file or the entire vault.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('file', 'File')
          .addOption('vault', 'Vault')
          .setValue(this.state.scope === 'file' ? 'file' : 'vault')
          .onChange((value) => {
            this.state.scope = value === 'file' ? 'file' : 'vault';
            this.refreshConditionalSections();
          });
      });

    const settingsShellEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-settings' });

    this.tabsEl = settingsShellEl.createDiv({ cls: 'word-cloud-embed-wizard-tabs' });
    this.tabsEl.setAttr('role', 'tablist');
    this.tabsEl.setAttr('aria-label', 'Embedded word cloud settings tabs');

    this.filtersTabButtonEl = this.buildTabButton('filters', 'Filters', true);
    this.appearanceTabButtonEl = this.buildTabButton('appearance', 'Appearance', false);
    this.advancedTabButtonEl = this.buildTabButton('advanced', 'Advanced', false);

    const panelsEl = settingsShellEl.createDiv({ cls: 'word-cloud-embed-wizard-panels' });

    this.filtersPanelEl = panelsEl.createDiv({ cls: 'word-cloud-embed-wizard-panel is-active' });
    this.filtersPanelEl.id = 'word-cloud-embed-wizard-panel-filters';
    this.filtersPanelEl.setAttr('role', 'tabpanel');
    this.filtersPanelEl.setAttr('aria-labelledby', this.filtersTabButtonEl.id);

    this.appearancePanelEl = panelsEl.createDiv({ cls: 'word-cloud-embed-wizard-panel' });
    this.appearancePanelEl.id = 'word-cloud-embed-wizard-panel-appearance';
    this.appearancePanelEl.setAttr('role', 'tabpanel');
    this.appearancePanelEl.setAttr('aria-labelledby', this.appearanceTabButtonEl.id);

    this.advancedPanelEl = panelsEl.createDiv({ cls: 'word-cloud-embed-wizard-panel' });
    this.advancedPanelEl.id = 'word-cloud-embed-wizard-panel-advanced';
    this.advancedPanelEl.setAttr('role', 'tabpanel');
    this.advancedPanelEl.setAttr('aria-labelledby', this.advancedTabButtonEl.id);
    this.advancedPanelEl.createEl('p', {
      cls: 'word-cloud-embed-wizard-description',
      text: 'No additional advanced settings are available.',
    });

    this.includeTagsWrapperEl = this.filtersPanelEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });
    this.matchModeWrapperEl = this.filtersPanelEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });

    this.sizeWrapperEl = this.appearancePanelEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });

    new Setting(this.sizeWrapperEl)
      .setName('Size')
      .setDesc('Select the embedded cloud size preset.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('small', 'Small')
          .addOption('medium', 'Medium')
          .addOption('large', 'Large')
          .setValue(this.state.size)
          .onChange((value) => {
            this.state.size = value === 'small' || value === 'large' ? value : 'medium';
          });
      });

    this.renderSpecificFileSetting();
    this.renderIncludeTagSetting();
    this.renderTagMatchModeSetting();

    const buttonRowEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-actions' });

    const cancelButton = new ButtonComponent(buttonRowEl)
      .setButtonText('Cancel')
      .onClick(() => {
        this.close();
      });
    cancelButton.buttonEl.type = 'button';

    const applyButton = new ButtonComponent(buttonRowEl)
      .setButtonText(this.submitButtonText)
      .setCta()
      .onClick(async () => {
        applyButton.setDisabled(true);
        try {
          const wasInserted = await this.onInsert(this.buildEmbedBlock());
          if (wasInserted && this.contentEl.isConnected) {
            this.close();
          }
        } catch (error) {
          console.error('Word clouds: failed to apply embed changes', error);
          new Notice('Could not apply word cloud changes.');
        }
        if (applyButton.buttonEl.isConnected) {
          applyButton.setDisabled(false);
        }
      });
    applyButton.buttonEl.type = 'button';

    this.refreshConditionalSections();
    this.switchTab('filters');
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private renderSpecificFileSetting(): void {
    this.specificFileWrapperEl.empty();

    const filePaths = this.app.vault
      .getMarkdownFiles()
      .map((file) => file.path)
      .sort((a, b) => a.localeCompare(b));
    const hasCurrent = filePaths.includes(this.state.specificFilePath);

    new Setting(this.specificFileWrapperEl)
      .setName('File')
      .setDesc('Select the file used when scope is set to file. Choose Current note to use the note containing this embed.')
      .addDropdown((dropdown) => {
        dropdown.addOption('', 'Current note');
        for (const filePath of filePaths) {
          dropdown.addOption(filePath, filePath);
        }
        if (this.state.specificFilePath && !hasCurrent) {
          dropdown.addOption(this.state.specificFilePath, this.state.specificFilePath);
        }

        dropdown
          .setValue(this.state.specificFilePath)
          .onChange((value) => {
            this.state.specificFilePath = value;
          });
      });
  }

  private renderIncludeTagSetting(): void {
    this.includeTagsWrapperEl.empty();

    const availableTags = this.services.getAvailableTags();
    const tagHint = availableTags.length > 0
      ? `Available: ${availableTags.slice(0, 12).join(', ')}${availableTags.length > 12 ? '…' : ''}`
      : 'No tags detected yet.';

    new Setting(this.includeTagsWrapperEl)
      .setName('Include tags')
      .setDesc(`Optional comma-separated tags to include. ${tagHint}`)
      .addText((text) => {
        text
          .setPlaceholder('#project, #meeting')
          .setValue(this.state.includeTagsRaw)
          .onChange((value) => {
            this.state.includeTagsRaw = value;
          });
      });
  }

  private renderTagMatchModeSetting(): void {
    this.matchModeWrapperEl.empty();

    new Setting(this.matchModeWrapperEl)
      .setName('Include match mode')
      .setDesc('How include tags should match when multiple tags are set.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('any', 'Any include tag')
          .addOption('all', 'All include tags')
          .setValue(this.state.tagMatchMode)
          .onChange((value) => {
            this.state.tagMatchMode = value === 'all' ? 'all' : 'any';
          });
      });
  }

  private refreshConditionalSections(): void {
    this.specificFileWrapperEl.toggleClass('is-hidden', this.state.scope !== 'file');
  }

  private buildTabButton(tab: EmbedSettingsTab, label: string, isActive: boolean): HTMLButtonElement {
    const buttonEl = this.tabsEl.createEl('button', {
      cls: `word-cloud-embed-wizard-tab${isActive ? ' is-active' : ''}`,
      text: label,
    });
    buttonEl.id = `word-cloud-embed-wizard-tab-${tab}`;
    buttonEl.type = 'button';
    buttonEl.setAttr('role', 'tab');
    buttonEl.setAttr('aria-controls', `word-cloud-embed-wizard-panel-${tab}`);
    buttonEl.setAttr('aria-selected', isActive ? 'true' : 'false');
    buttonEl.setAttr('tabindex', isActive ? '0' : '-1');
    buttonEl.addEventListener('click', () => {
      this.switchTab(tab);
    });
    buttonEl.addEventListener('keydown', (event) => {
      this.handleTabKeydown(event, tab);
    });
    return buttonEl;
  }

  private handleTabKeydown(event: KeyboardEvent, currentTab: EmbedSettingsTab): void {
    const tabs: EmbedSettingsTab[] = ['filters', 'appearance', 'advanced'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex === -1) {
      return;
    }

    if (event.key === 'ArrowRight') {
      const nextTab = tabs[(currentIndex + 1) % tabs.length];
      this.switchTab(nextTab);
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowLeft') {
      const nextTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
      this.switchTab(nextTab);
      event.preventDefault();
      return;
    }

    if (event.key === 'Home') {
      this.switchTab(tabs[0]);
      event.preventDefault();
      return;
    }

    if (event.key === 'End') {
      this.switchTab(tabs[tabs.length - 1]);
      event.preventDefault();
    }
  }

  private switchTab(tab: EmbedSettingsTab): void {
    const showFilters = tab === 'filters';
    const showAppearance = tab === 'appearance';
    const showAdvanced = tab === 'advanced';

    this.filtersTabButtonEl.toggleClass('is-active', showFilters);
    this.filtersTabButtonEl.setAttr('aria-selected', showFilters ? 'true' : 'false');
    this.filtersTabButtonEl.setAttr('tabindex', showFilters ? '0' : '-1');

    this.appearanceTabButtonEl.toggleClass('is-active', showAppearance);
    this.appearanceTabButtonEl.setAttr('aria-selected', showAppearance ? 'true' : 'false');
    this.appearanceTabButtonEl.setAttr('tabindex', showAppearance ? '0' : '-1');

    this.advancedTabButtonEl.toggleClass('is-active', showAdvanced);
    this.advancedTabButtonEl.setAttr('aria-selected', showAdvanced ? 'true' : 'false');
    this.advancedTabButtonEl.setAttr('tabindex', showAdvanced ? '0' : '-1');

    this.filtersPanelEl.toggleClass('is-active', showFilters);
    this.appearancePanelEl.toggleClass('is-active', showAppearance);
    this.advancedPanelEl.toggleClass('is-active', showAdvanced);

    const targetButton = showFilters
      ? this.filtersTabButtonEl
      : showAppearance
        ? this.appearanceTabButtonEl
        : this.advancedTabButtonEl;

    if (document.activeElement && this.tabsEl.contains(document.activeElement)) {
      targetButton.focus();
    }
  }

  private buildEmbedBlock(): string {
    const lines = ['```wordcloud', `id: ${this.state.cloudId}`, `scope: ${this.state.scope}`, `size: ${this.state.size}`];
    const includeTags = parseTagList(this.state.includeTagsRaw);
    const excludeTags = parseTagList(this.state.excludeTagsRaw).filter((tag) => !includeTags.includes(tag));
    const folderPaths = parseList(this.state.folderPathsRaw);
    const frontmatterRules = parseFrontmatterRules(this.state.frontmatterRulesRaw);
    const minCount = parseCount(this.state.minCountRaw);
    const maxCount = parseCount(this.state.maxCountRaw);
    const specificFilePath = this.state.specificFilePath.trim();

    if (specificFilePath && this.state.scope === 'file') {
      lines.push(`file: ${specificFilePath}`);
    }
    if (includeTags.length > 0) {
      lines.push(`include-tags: ${includeTags.join(', ')}`);
    }
    if (excludeTags.length > 0) {
      lines.push(`exclude-tags: ${excludeTags.join(', ')}`);
    }
    if (includeTags.length > 1 || this.state.tagMatchMode === 'all') {
      lines.push(`tag-match: ${this.state.tagMatchMode}`);
    }
    if (folderPaths.length > 0 && this.state.scope === 'folder') {
      lines.push(`folder-paths: ${folderPaths.join(', ')}`);
    }
    if (frontmatterRules.length > 0) {
      lines.push(`frontmatter-rules: ${frontmatterRules.map(serializeFrontmatterRule).join('; ')}`);
    }
    if (minCount !== null) {
      lines.push(`min-count: ${minCount}`);
    }
    if (maxCount !== null) {
      lines.push(`max-count: ${maxCount}`);
    }

    lines.push('```');

    return lines.join('\n');
  }
}

function parseList(rawValue: string): string[] {
  return [...new Set(rawValue
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0))];
}

function parseTagList(rawValue: string): string[] {
  const tags = new Set<string>();
  for (const entry of parseList(rawValue)) {
    const normalized = normalizeTag(entry);
    if (normalized) {
      tags.add(normalized);
    }
  }
  return [...tags];
}

function parseCount(rawValue: string): number | null {
  const parsed = Number.parseInt(rawValue.trim(), 10);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return Math.min(9999, Math.max(1, parsed));
}

function parseFrontmatterRules(rawValue: string): FrontmatterRule[] {
  const rules: FrontmatterRule[] = [];
  const entries = rawValue
    .split(';')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  for (const entry of entries) {
    const parts = entry.split('|').map((part) => part.trim());
    const key = parts[0] ?? '';
    if (!key) {
      continue;
    }

    const rawOperator = parts[1] ?? '';
    const operator = FRONTMATTER_OPERATORS.includes(rawOperator as FrontmatterOperator)
      ? rawOperator as FrontmatterOperator
      : 'equals';
    const value = parts.slice(2).join('|').trim();

    if (operator === 'exists' || operator === 'not-exists') {
      rules.push({ key, operator });
      continue;
    }

    rules.push({ key, operator, value });
  }

  return rules;
}

function serializeFrontmatterRule(rule: FrontmatterRule): string {
  if (rule.operator === 'exists' || rule.operator === 'not-exists') {
    return `${rule.key}|${rule.operator}|`;
  }
  return `${rule.key}|${rule.operator}|${rule.value ?? ''}`;
}

function createEmbedCloudId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const randomPart = Math.random().toString(36).slice(2, 10);
  const timePart = Date.now().toString(36);
  return `wc-${timePart}-${randomPart}`;
}
