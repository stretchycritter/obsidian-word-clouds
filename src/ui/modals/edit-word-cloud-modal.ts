import { App, ButtonComponent, Modal, Notice, Setting } from 'obsidian';
import type { WordCloudServices } from '@/services/types';
import type {
  FrontmatterOperator,
  FrontmatterRule,
  RenderSettings,
  RotationPreset,
  ScalingMode,
  SpiralType,
  TagMatchMode,
  WordCloudSettings,
} from '@/settings/types';
import { DEFAULT_SETTINGS, SUPPORTED_FONT_FAMILIES } from '@/settings/constants';
import { t } from '@/i18n';
import { normalizeTag } from '@/utils/utils';
import { renderFilterSettingsPanel } from '@/ui/components/filter-settings-panel';
import { FileSuggest, FolderSuggest } from '@/ui/components/suggest';

export type EmbedScope = 'file' | 'vault' | 'folder';
export type EmbedSize = 'small' | 'medium' | 'large' | 'xl';

type SettingsSnapshotProvider = {
  getSettingsSnapshot: () => Readonly<WordCloudSettings>;
};

export type EmbedWizardState = {
  cloudId: string;
  scope: EmbedScope;
  size: EmbedSize;
  specificFilePath: string;
  includeTagsRaw: string;
  excludeTagsRaw: string;
  tagMatchMode: TagMatchMode;
  folderPathsRaw: string;
  frontmatterRulesRaw: string;
  minCountRaw: string;
  maxCountRaw: string;
  excludeWordsRaw: string;
  minWordLength: number;
  nlpEnabled: boolean;
  nlpMode: 'off' | 'light' | 'aggressive';
  preserveAcronyms: boolean;
  minLemmaLength: number;
  filterNumericTokens: boolean;
  renderOverride: Partial<RenderSettings>;
};

type EmbedWordCloudModalOptions = {
  mode: 'create' | 'edit';
  initialState?: Partial<EmbedWizardState>;
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

function getSettingsDefaults(services: WordCloudServices): Readonly<WordCloudSettings> {
  if ('getSettingsSnapshot' in services && typeof services.getSettingsSnapshot === 'function') {
    return (services as WordCloudServices & SettingsSnapshotProvider).getSettingsSnapshot();
  }
  return DEFAULT_SETTINGS;
}

function createDefaultState(settings: Readonly<WordCloudSettings>): EmbedWizardState {
  return {
    cloudId: '',
    scope: settings.defaultScopeOnInsert,
    size: 'medium',
    specificFilePath: settings.filters.scope.activeFilePath ?? '',
    includeTagsRaw: settings.filters.includeTags.join(', '),
    excludeTagsRaw: settings.filters.excludeTags.join(', '),
    tagMatchMode: settings.filters.tagMatchMode,
    folderPathsRaw: (settings.filters.scope.folderPaths ?? []).join(', '),
    frontmatterRulesRaw: settings.filters.frontmatterRules.map(serializeFrontmatterRule).join('; '),
    minCountRaw: `${settings.filters.frequency.minCount}`,
    maxCountRaw: `${settings.filters.frequency.maxCount}`,
    excludeWordsRaw: '',
    minWordLength: settings.filters.minWordLength,
    nlpEnabled: settings.filters.nlp.enabled,
    nlpMode: settings.filters.nlp.mode,
    preserveAcronyms: settings.filters.nlp.preserveAcronyms,
    minLemmaLength: settings.filters.nlp.minLemmaLength,
    filterNumericTokens: settings.filters.nlp.filterNumericTokens,
    renderOverride: {},
  };
}

function getFontLabel(value: string, fallback: string): string {
  const keyByValue: Record<string, string> = {
    'sans-serif': 'settings.tab.render.fontFamily.options.sansSerif',
    'serif': 'settings.tab.render.fontFamily.options.serif',
    'monospace': 'settings.tab.render.fontFamily.options.monospace',
    'Arial, sans-serif': 'settings.tab.render.fontFamily.options.arial',
    'Verdana, sans-serif': 'settings.tab.render.fontFamily.options.verdana',
    '"Trebuchet MS", sans-serif': 'settings.tab.render.fontFamily.options.trebuchetMs',
    '"Times New Roman", serif': 'settings.tab.render.fontFamily.options.timesNewRoman',
    'Georgia, serif': 'settings.tab.render.fontFamily.options.georgia',
    '"Palatino Linotype", serif': 'settings.tab.render.fontFamily.options.palatinoLinotype',
    '"Courier New", monospace': 'settings.tab.render.fontFamily.options.courierNew',
  };

  const translationKey = keyByValue[value];
  return translationKey ? t(translationKey) : fallback;
}

function resolveEffectiveFont(rawFontFamily: string): string {
  const trimmed = rawFontFamily.trim();
  const supported = new Set(SUPPORTED_FONT_FAMILIES.map((opt) => opt.value));
  return supported.has(trimmed) ? trimmed : DEFAULT_SETTINGS.render.fontFamily;
}

function effectiveRender<K extends keyof RenderSettings>(
  key: K,
  overrides: Partial<RenderSettings>,
  defaults: Readonly<RenderSettings>,
): RenderSettings[K] {
  const value = overrides[key];
  return value !== undefined ? (value as RenderSettings[K]) : defaults[key];
}

export class EmbedWordCloudModal extends Modal {
  private readonly services: WordCloudServices;
  private readonly onInsert: (embedBlock: string) => boolean | Promise<boolean>;
  private readonly state: EmbedWizardState;
  private readonly settingsDefaults: Readonly<WordCloudSettings>;
  private readonly submitButtonText: string;

  private specificFileWrapperEl!: HTMLDivElement;
  private folderPathsWrapperEl!: HTMLDivElement;
  private layoutPanelEl!: HTMLDivElement;

  constructor(
    app: App,
    services: WordCloudServices,
    onInsert: (embedBlock: string) => boolean | Promise<boolean>,
    options: EmbedWordCloudModalOptions,
  ) {
    super(app);
    this.services = services;
    this.onInsert = onInsert;
    this.submitButtonText = options.mode === 'edit' ? t('ui.modals.embed.apply') : t('ui.modals.embed.insert');
    this.settingsDefaults = getSettingsDefaults(services);

    const defaultState = createDefaultState(this.settingsDefaults);
    const initialState = options.initialState ?? {};
    this.state = {
      ...defaultState,
      ...initialState,
    };

    if (!this.state.cloudId) {
      this.state.cloudId = createEmbedCloudId();
    }
  }

  onOpen(): void {
    this.modalEl.addClass('word-cloud-embed-wizard-modal');

    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('word-cloud-embed-wizard');

    // Scope row — compact header, always visible above tabs
    // Scope dropdown is first (left), file/folder input is last (right)
    const scopeRowEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-scope-row' });

    new Setting(scopeRowEl)
      .setName(t('ui.modals.embed.scope.name'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('file', t('ui.modals.embed.scope.file'))
          .addOption('vault', t('ui.modals.embed.scope.vault'))
          .addOption('folder', t('ui.modals.embed.scope.folder'))
          .setValue(this.state.scope)
          .onChange((value) => {
            this.state.scope = value === 'vault' || value === 'folder' ? value : 'file';
            this.refreshScopeSections();
          });
      });

    this.specificFileWrapperEl = scopeRowEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });
    this.renderSpecificFileSetting();

    this.folderPathsWrapperEl = scopeRowEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });
    new Setting(this.folderPathsWrapperEl)
      .setName('')
      .addText((text) => {
        text
          .setPlaceholder(t('ui.modals.embed.folderPaths.placeholder'))
          .setValue(this.state.folderPathsRaw)
          .onChange((value) => {
            this.state.folderPathsRaw = value;
          });
        new FolderSuggest(this.app, text.inputEl, (path) => {
          this.state.folderPathsRaw = path;
        });
      });

    // Settings area with tabs
    const settingsShellEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-settings' });

    // Tab bar
    const tabBarEl = settingsShellEl.createDiv({ cls: 'word-cloud-embed-wizard-tabs' });
    tabBarEl.setAttr('role', 'tablist');
    tabBarEl.setAttr('aria-label', t('ui.modals.embed.tabs.ariaLabel'));

    // Panels container
    const panelsEl = settingsShellEl.createDiv({ cls: 'word-cloud-embed-wizard-panels' });
    const filtersPanelEl = panelsEl.createDiv({ cls: 'word-cloud-embed-wizard-panel' });
    this.layoutPanelEl = panelsEl.createDiv({ cls: 'word-cloud-embed-wizard-panel' });
    const interactionsPanelEl = panelsEl.createDiv({ cls: 'word-cloud-embed-wizard-panel' });

    // Build tabs
    const tabDefs = [
      { key: 'filters', label: t('ui.modals.embed.tabs.filters'), panel: filtersPanelEl },
      { key: 'layout', label: t('ui.modals.embed.tabs.layout'), panel: this.layoutPanelEl },
      { key: 'interactions', label: t('ui.modals.embed.tabs.interactions'), panel: interactionsPanelEl },
    ];

    const tabEls: HTMLButtonElement[] = [];

    for (const tabDef of tabDefs) {
      const tabEl = tabBarEl.createEl('button', {
        cls: 'word-cloud-embed-wizard-tab',
        text: tabDef.label,
      });
      tabEl.type = 'button';
      tabEl.setAttr('role', 'tab');
      tabEl.setAttr('aria-selected', 'false');
      tabEls.push(tabEl);

      tabEl.addEventListener('click', () => {
        for (let i = 0; i < tabEls.length; i++) {
          tabEls[i].removeClass('is-active');
          tabEls[i].setAttr('aria-selected', 'false');
          tabDefs[i].panel.removeClass('is-active');
        }
        tabEl.addClass('is-active');
        tabEl.setAttr('aria-selected', 'true');
        tabDef.panel.addClass('is-active');
      });
    }

    // Activate first tab
    tabEls[0].addClass('is-active');
    tabEls[0].setAttr('aria-selected', 'true');
    filtersPanelEl.addClass('is-active');

    // Render panel contents
    this.renderFiltersPanel(filtersPanelEl);
    this.renderLayoutPanel();
    this.renderInteractionsPanel(interactionsPanelEl);

    const buttonRowEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-actions' });

    const cancelButton = new ButtonComponent(buttonRowEl)
      .setButtonText(t('ui.modals.embed.cancel'))
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
          new Notice(t('ui.modals.embed.applyError'));
        }
        if (applyButton.buttonEl.isConnected) {
          applyButton.setDisabled(false);
        }
      });
    applyButton.buttonEl.type = 'button';

    this.refreshScopeSections();

    // Submit on Enter when no input field is focused (e.g. on initial open)
    this.scope.register([], 'Enter', (event) => {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement) {
        return;
      }
      event.preventDefault();
      applyButton.buttonEl.click();
    });

    // Prevent auto-focus on any input when the modal opens
    (document.activeElement as HTMLElement)?.blur();
  }

  onClose(): void {
    this.modalEl.removeClass('word-cloud-embed-wizard-modal');
    this.contentEl.empty();
  }

  private renderFiltersPanel(panelEl: HTMLDivElement): void {
    new Setting(panelEl)
      .setName(t('ui.modals.embed.includeTags.name'))
      .setDesc(t('ui.modals.embed.includeTags.desc').replace('{hint}', this.buildAvailableTagHint()))
      .addText((text) => {
        text
          .setPlaceholder(t('ui.modals.embed.includeTags.placeholder'))
          .setValue(this.state.includeTagsRaw)
          .onChange((value) => {
            this.state.includeTagsRaw = value;
          });
      });

    new Setting(panelEl)
      .setName(t('ui.modals.embed.excludeTags.name'))
      .setDesc(t('ui.modals.embed.excludeTags.desc'))
      .addText((text) => {
        text
          .setPlaceholder(t('ui.modals.embed.excludeTags.placeholder'))
          .setValue(this.state.excludeTagsRaw)
          .onChange((value) => {
            this.state.excludeTagsRaw = value;
          });
      });

    new Setting(panelEl)
      .setName(t('ui.modals.embed.matchMode.name'))
      .setDesc(t('ui.modals.embed.matchMode.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('any', t('ui.modals.embed.matchMode.any'))
          .addOption('all', t('ui.modals.embed.matchMode.all'))
          .setValue(this.state.tagMatchMode)
          .onChange((value) => {
            this.state.tagMatchMode = value === 'all' ? 'all' : 'any';
          });
      });

    new Setting(panelEl)
      .setName(t('ui.modals.embed.frontmatterRules.name'))
      .setDesc(t('ui.modals.embed.frontmatterRules.desc'))
      .addText((text) => {
        text
          .setPlaceholder(t('ui.modals.embed.frontmatterRules.placeholder'))
          .setValue(this.state.frontmatterRulesRaw)
          .onChange((value) => {
            this.state.frontmatterRulesRaw = value;
          });
      });

    new Setting(panelEl)
      .setName(t('ui.modals.embed.minCount.name'))
      .setDesc(t('ui.modals.embed.minCount.desc'))
      .addText((text) => {
        text
          .setPlaceholder('1')
          .setValue(this.state.minCountRaw)
          .onChange((value) => {
            this.state.minCountRaw = value;
          });
      });

    new Setting(panelEl)
      .setName(t('ui.modals.embed.maxCount.name'))
      .setDesc(t('ui.modals.embed.maxCount.desc'))
      .addText((text) => {
        text
          .setPlaceholder('9999')
          .setValue(this.state.maxCountRaw)
          .onChange((value) => {
            this.state.maxCountRaw = value;
          });
      });

    new Setting(panelEl)
      .setName(t('ui.modals.embed.excludeWords.name'))
      .setDesc(t('ui.modals.embed.excludeWords.desc'))
      .addText((text) => {
        text
          .setPlaceholder(t('ui.modals.embed.excludeWords.placeholder'))
          .setValue(this.state.excludeWordsRaw)
          .onChange((value) => {
            this.state.excludeWordsRaw = value;
          });
      });

    renderFilterSettingsPanel(
      panelEl,
      {
        minWordLength: this.state.minWordLength,
        nlp: {
          enabled: this.state.nlpEnabled,
          mode: this.state.nlpMode,
          preserveAcronyms: this.state.preserveAcronyms,
          minLemmaLength: this.state.minLemmaLength,
          filterNumericTokens: this.state.filterNumericTokens,
        },
      },
      {
        onMinWordLengthChange: (value) => {
          this.state.minWordLength = value;
        },
        onNlpSettingsChange: (nlp) => {
          this.state.nlpEnabled = nlp.enabled;
          this.state.nlpMode = nlp.mode;
          this.state.preserveAcronyms = nlp.preserveAcronyms;
          this.state.minLemmaLength = nlp.minLemmaLength;
          this.state.filterNumericTokens = nlp.filterNumericTokens;
        },
      },
    );
  }

  private renderLayoutPanel(): void {
    const panelEl = this.layoutPanelEl;
    panelEl.empty();

    const defaults = this.settingsDefaults.render;
    const overrides = this.state.renderOverride;

    new Setting(panelEl)
      .setName(t('ui.modals.embed.size.name'))
      .setDesc(t('ui.modals.embed.size.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('small', t('ui.modals.embed.size.small'))
          .addOption('medium', t('ui.modals.embed.size.medium'))
          .addOption('large', t('ui.modals.embed.size.large'))
          .addOption('xl', t('ui.modals.embed.size.xl'))
          .setValue(this.state.size)
          .onChange((value) => {
            this.state.size = value === 'small' || value === 'large' || value === 'xl' ? value : 'medium';
          });
      });

    new Setting(panelEl)
      .setName(t('settings.tab.render.fontFamily.name'))
      .setDesc(t('settings.tab.render.fontFamily.desc'))
      .addDropdown((dropdown) => {
        for (const font of SUPPORTED_FONT_FAMILIES) {
          dropdown.addOption(font.value, getFontLabel(font.value, font.label));
        }
        dropdown
          .setValue(resolveEffectiveFont(effectiveRender('fontFamily', overrides, defaults)))
          .onChange((value) => {
            overrides.fontFamily = value;
          });
      });

    new Setting(panelEl)
      .setName(t('settings.tab.render.wordCaseMode.name'))
      .setDesc(t('settings.tab.render.wordCaseMode.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('lowercase', t('settings.tab.render.wordCaseMode.lowercase'))
          .addOption('normalized', t('settings.tab.render.wordCaseMode.normalized'))
          .setValue(effectiveRender('wordCaseMode', overrides, defaults))
          .onChange((value) => {
            overrides.wordCaseMode = value === 'normalized' ? 'normalized' : 'lowercase';
          });
      });

    new Setting(panelEl)
      .setName(t('settings.tab.render.showCount.name'))
      .setDesc(t('settings.tab.render.showCount.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(effectiveRender('showCountInWordText', overrides, defaults))
          .onChange((value) => {
            overrides.showCountInWordText = value;
          });
      });

    new Setting(panelEl)
      .setName(t('settings.tab.render.rotation.name'))
      .setDesc(t('settings.tab.render.rotation.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('horizontal', t('settings.tab.render.rotation.horizontal'))
          .addOption('mostly-horizontal', t('settings.tab.render.rotation.mostlyHorizontal'))
          .addOption('mixed', t('settings.tab.render.rotation.mixed'))
          .addOption('vertical', t('settings.tab.render.rotation.vertical'))
          .setValue(effectiveRender('rotationPreset', overrides, defaults))
          .onChange((value) => {
            overrides.rotationPreset = value as RotationPreset;
          });
      });

    new Setting(panelEl)
      .setName(t('settings.tab.render.spiral.name'))
      .setDesc(t('settings.tab.render.spiral.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('archimedean', t('settings.tab.render.spiral.archimedean'))
          .addOption('rectangular', t('settings.tab.render.spiral.rectangular'))
          .setValue(effectiveRender('spiral', overrides, defaults))
          .onChange((value) => {
            overrides.spiral = value as SpiralType;
          });
      });

    new Setting(panelEl)
      .setName(t('settings.tab.render.wordPadding.name'))
      .setDesc(t('settings.tab.render.wordPadding.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(0, 12, 1)
          .setValue(effectiveRender('wordPadding', overrides, defaults))
          .setDynamicTooltip()
          .onChange((value) => {
            overrides.wordPadding = value;
          });
      });

    new Setting(panelEl)
      .setName(t('settings.tab.render.fontSizeMin.name'))
      .setDesc(t('settings.tab.render.fontSizeMin.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(8, 64, 1)
          .setValue(effectiveRender('minFontSize', overrides, defaults))
          .setDynamicTooltip()
          .onChange((value) => {
            overrides.minFontSize = value;
          });
      });

    new Setting(panelEl)
      .setName(t('settings.tab.render.fontSizeMax.name'))
      .setDesc(t('settings.tab.render.fontSizeMax.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(16, 140, 1)
          .setValue(effectiveRender('maxFontSize', overrides, defaults))
          .setDynamicTooltip()
          .onChange((value) => {
            overrides.maxFontSize = value;
          });
      });

    const currentScalingMode = effectiveRender('scalingMode', overrides, defaults);

    const scalingModeSetting = new Setting(panelEl)
      .setName(t('settings.tab.render.scalingMode.name'))
      .setDesc(t('settings.tab.render.scalingMode.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('linear', t('settings.tab.render.scalingMode.linear'))
          .addOption('power', t('settings.tab.render.scalingMode.power'))
          .addOption('log', t('settings.tab.render.scalingMode.log'))
          .addOption('rank', t('settings.tab.render.scalingMode.rank'))
          .setValue(currentScalingMode)
          .onChange((value) => {
            overrides.scalingMode = value as ScalingMode;
            this.renderLayoutPanel();
          });
      });

    if (currentScalingMode === 'power') {
      scalingModeSetting.addSlider((slider) => {
        slider
          .setLimits(0.5, 3, 0.1)
          .setValue(effectiveRender('emphasis', overrides, defaults))
          .setDynamicTooltip()
          .onChange((value) => {
            overrides.emphasis = value;
          });
      });
    }

    const currentDeterministic = effectiveRender('deterministicLayout', overrides, defaults);

    const deterministicSetting = new Setting(panelEl)
      .setName(t('settings.tab.render.deterministicLayout.name'))
      .setDesc(t('settings.tab.render.deterministicLayout.desc'));

    if (currentDeterministic) {
      deterministicSetting.addText((text) => {
        text.setPlaceholder(t('settings.tab.render.deterministicLayout.seedPlaceholder'));
        text
          .setValue(String(effectiveRender('randomSeed', overrides, defaults)))
          .onChange((value) => {
            const parsed = Number.parseInt(value, 10);
            if (!Number.isNaN(parsed)) {
              overrides.randomSeed = parsed;
            }
          });
      });
    }

    deterministicSetting.addToggle((toggle) => {
      toggle
        .setValue(currentDeterministic)
        .onChange((value) => {
          overrides.deterministicLayout = value;
          this.renderLayoutPanel();
        });
    });
  }

  private renderInteractionsPanel(panelEl: HTMLDivElement): void {
    const defaults = this.settingsDefaults.render;
    const overrides = this.state.renderOverride;

    new Setting(panelEl)
      .setName(t('settings.tab.render.mouseInteractions.name'))
      .setDesc(t('settings.tab.render.mouseInteractions.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(effectiveRender('enableMouseInteractions', overrides, defaults))
          .onChange((value) => {
            overrides.enableMouseInteractions = value;
          });
      });

    new Setting(panelEl)
      .setName(t('settings.tab.render.clickToSearch.name'))
      .setDesc(t('settings.tab.render.clickToSearch.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(effectiveRender('enableWordClickSearch', overrides, defaults))
          .onChange((value) => {
            overrides.enableWordClickSearch = value;
          });
      });

    new Setting(panelEl)
      .setName(t('settings.tab.render.controls.name'))
      .setDesc(t('settings.tab.render.controls.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(effectiveRender('enableControls', overrides, defaults))
          .onChange((value) => {
            overrides.enableControls = value;
          });
      });

    new Setting(panelEl)
      .setName(t('settings.tab.render.exporting.name'))
      .setDesc(t('settings.tab.render.exporting.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(effectiveRender('enableExporting', overrides, defaults))
          .onChange((value) => {
            overrides.enableExporting = value;
          });
      });
  }

  private renderSpecificFileSetting(): void {
    this.specificFileWrapperEl.empty();

    new Setting(this.specificFileWrapperEl)
      .setName('')
      .addText((text) => {
        text
          .setPlaceholder(t('ui.modals.embed.file.placeholder'))
          .setValue(this.state.specificFilePath)
          .onChange((value) => {
            this.state.specificFilePath = value;
          });
        new FileSuggest(this.app, text.inputEl, (path) => {
          this.state.specificFilePath = path;
        });
      });
  }

  private refreshScopeSections(): void {
    this.specificFileWrapperEl.toggleClass('is-hidden', this.state.scope !== 'file');
    this.folderPathsWrapperEl.toggleClass('is-hidden', this.state.scope !== 'folder');
  }

  private buildAvailableTagHint(): string {
    const availableTags = this.services.getAvailableTags();
    return availableTags.length > 0
      ? t('ui.modals.embed.includeTags.availableHint')
        .replace('{tags}', `${availableTags.slice(0, 12).join(', ')}${availableTags.length > 12 ? '…' : ''}`)
      : t('ui.modals.embed.includeTags.noneDetected');
  }

  private buildEmbedBlock(): string {
    const data: Record<string, string> = {};

    data.scope = this.state.scope;
    data.size = this.state.size;

    const includeTags = parseTagList(this.state.includeTagsRaw);
    const excludeTags = parseTagList(this.state.excludeTagsRaw).filter((tag) => !includeTags.includes(tag));
    const folderPaths = parseList(this.state.folderPathsRaw);
    const frontmatterRules = parseFrontmatterRules(this.state.frontmatterRulesRaw);
    const minCount = parseCount(this.state.minCountRaw, DEFAULT_SETTINGS.filters.frequency.minCount);
    const maxCount = parseCount(this.state.maxCountRaw, DEFAULT_SETTINGS.filters.frequency.maxCount);
    const excludeWords = parseWordList(this.state.excludeWordsRaw);
    const specificFilePath = this.state.specificFilePath.trim();

    if (this.state.scope === 'file') {
      const defaultFilePath = DEFAULT_SETTINGS.filters.scope.activeFilePath ?? '';
      if (specificFilePath !== defaultFilePath) {
        data.file = specificFilePath;
      }
    }

    if (this.state.scope === 'folder' && folderPaths.length > 0) {
      data['folder-paths'] = folderPaths.join(', ');
    }

    if (includeTags.length > 0) {
      data['include-tags'] = includeTags.join(', ');
    }
    if (excludeTags.length > 0) {
      data['exclude-tags'] = excludeTags.join(', ');
    }

    if (this.state.tagMatchMode !== DEFAULT_SETTINGS.filters.tagMatchMode) {
      data['tag-match'] = this.state.tagMatchMode;
    }

    if (!areFrontmatterRulesEqual(frontmatterRules, DEFAULT_SETTINGS.filters.frontmatterRules)) {
      data['frontmatter-rules'] = frontmatterRules.map(serializeFrontmatterRule).join('; ');
    }

    if (minCount !== DEFAULT_SETTINGS.filters.frequency.minCount) {
      data['min-count'] = String(minCount);
    }
    if (maxCount !== DEFAULT_SETTINGS.filters.frequency.maxCount) {
      data['max-count'] = String(maxCount);
    }

    if (excludeWords.length > 0) {
      data['exclude-words'] = excludeWords.join(', ');
    }

    if (this.state.minWordLength !== DEFAULT_SETTINGS.filters.minWordLength) {
      data['min-word-length'] = String(this.state.minWordLength);
    }

    if (this.state.nlpEnabled !== DEFAULT_SETTINGS.filters.nlp.enabled) {
      data['nlp-enabled'] = String(this.state.nlpEnabled);
    }
    if (this.state.nlpMode !== DEFAULT_SETTINGS.filters.nlp.mode) {
      data['nlp-mode'] = this.state.nlpMode;
    }
    if (this.state.preserveAcronyms !== DEFAULT_SETTINGS.filters.nlp.preserveAcronyms) {
      data['nlp-preserve-acronyms'] = String(this.state.preserveAcronyms);
    }
    if (this.state.minLemmaLength !== DEFAULT_SETTINGS.filters.nlp.minLemmaLength) {
      data['nlp-min-lemma-length'] = String(this.state.minLemmaLength);
    }
    if (this.state.filterNumericTokens !== DEFAULT_SETTINGS.filters.nlp.filterNumericTokens) {
      data['nlp-filter-numeric-tokens'] = String(this.state.filterNumericTokens);
    }

    // Render overrides — only encode values that differ from defaults
    const renderDefaults = DEFAULT_SETTINGS.render;
    const ro = this.state.renderOverride;

    if (ro.fontFamily !== undefined && ro.fontFamily !== renderDefaults.fontFamily) {
      data['font-family'] = ro.fontFamily;
    }
    if (ro.wordCaseMode !== undefined && ro.wordCaseMode !== renderDefaults.wordCaseMode) {
      data['word-case-mode'] = ro.wordCaseMode;
    }
    if (ro.showCountInWordText !== undefined && ro.showCountInWordText !== renderDefaults.showCountInWordText) {
      data['show-count-in-word-text'] = String(ro.showCountInWordText);
    }
    if (ro.rotationPreset !== undefined && ro.rotationPreset !== renderDefaults.rotationPreset) {
      data['rotation'] = ro.rotationPreset;
    }
    if (ro.spiral !== undefined && ro.spiral !== renderDefaults.spiral) {
      data['spiral'] = ro.spiral;
    }
    if (ro.wordPadding !== undefined && ro.wordPadding !== renderDefaults.wordPadding) {
      data['word-padding'] = String(ro.wordPadding);
    }
    if (ro.minFontSize !== undefined && ro.minFontSize !== renderDefaults.minFontSize) {
      data['min-font-size'] = String(ro.minFontSize);
    }
    if (ro.maxFontSize !== undefined && ro.maxFontSize !== renderDefaults.maxFontSize) {
      data['max-font-size'] = String(ro.maxFontSize);
    }
    if (ro.scalingMode !== undefined && ro.scalingMode !== renderDefaults.scalingMode) {
      data['scaling-mode'] = ro.scalingMode;
    }
    if (ro.emphasis !== undefined && ro.emphasis !== renderDefaults.emphasis) {
      data['emphasis'] = String(ro.emphasis);
    }
    if (ro.deterministicLayout !== undefined && ro.deterministicLayout !== renderDefaults.deterministicLayout) {
      data['deterministic-layout'] = String(ro.deterministicLayout);
    }
    if (ro.randomSeed !== undefined && ro.randomSeed !== renderDefaults.randomSeed) {
      data['random-seed'] = String(ro.randomSeed);
    }
    if (ro.enableMouseInteractions !== undefined && ro.enableMouseInteractions !== renderDefaults.enableMouseInteractions) {
      data['enable-mouse-interactions'] = String(ro.enableMouseInteractions);
    }
    if (ro.enableWordClickSearch !== undefined && ro.enableWordClickSearch !== renderDefaults.enableWordClickSearch) {
      data['enable-click-to-search'] = String(ro.enableWordClickSearch);
    }
    if (ro.enableControls !== undefined && ro.enableControls !== renderDefaults.enableControls) {
      data['enable-controls'] = String(ro.enableControls);
    }
    if (ro.enableExporting !== undefined && ro.enableExporting !== renderDefaults.enableExporting) {
      data['enable-exporting'] = String(ro.enableExporting);
    }

    const dataEncoded = btoa(JSON.stringify(data));

    return `\`\`\`wordcloud
id: ${this.state.cloudId}
data: ${dataEncoded}
\`\`\``;
  }
}

function parseList(rawValue: string): string[] {
  return [...new Set(rawValue
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0))];
}

function parseWordList(rawValue: string): string[] {
  return [...new Set(rawValue
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
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

function parseCount(rawValue: string, fallback: number): number {
  const parsed = Number.parseInt(rawValue.trim(), 10);
  if (Number.isNaN(parsed)) {
    return fallback;
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

function areFrontmatterRulesEqual(left: FrontmatterRule[], right: FrontmatterRule[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftRule = left[index];
    const rightRule = right[index];
    if (!rightRule) {
      return false;
    }

    if (leftRule.key !== rightRule.key || leftRule.operator !== rightRule.operator || (leftRule.value ?? '') !== (rightRule.value ?? '')) {
      return false;
    }
  }

  return true;
}

function createEmbedCloudId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const randomPart = Math.random().toString(36).slice(2, 10);
  const timePart = Date.now().toString(36);
  return `wc-${timePart}-${randomPart}`;
}
