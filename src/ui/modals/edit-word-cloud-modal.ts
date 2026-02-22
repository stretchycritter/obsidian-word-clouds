import { App, ButtonComponent, Modal, Notice, Setting } from 'obsidian';
import type { WordCloudServices } from '@/services/types';
import type {
  FrontmatterOperator,
  FrontmatterRule,
  NlpMode,
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

export type EmbedScope = 'file' | 'vault' | 'folder';
export type EmbedSize = 'small' | 'medium' | 'large' | 'xl';
type EmbedSettingsTab = 'filters' | 'display' | 'interactions';

type SettingsSnapshotProvider = {
  getSettingsSnapshot: () => Readonly<WordCloudSettings>;
};

type FontOptionsProvider = {
  getSupportedFontFamilyOptions: () => ReadonlyArray<{ value: string; label: string }>;
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
  nlpMode: NlpMode;
  preserveAcronyms: boolean;
  minLemmaLength: number;
  filterNumericTokens: boolean;
  render: RenderSettings;
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

const ROTATION_PRESETS: RotationPreset[] = [
  'horizontal',
  'mostly-horizontal',
  'mixed',
  'vertical',
];

const SPIRAL_TYPES: SpiralType[] = [
  'archimedean',
  'rectangular',
];

const SCALING_MODES: ScalingMode[] = [
  'linear',
  'power',
  'log',
  'rank',
];

function getSettingsDefaults(services: WordCloudServices): Readonly<WordCloudSettings> {
  if ('getSettingsSnapshot' in services && typeof services.getSettingsSnapshot === 'function') {
    return (services as WordCloudServices & SettingsSnapshotProvider).getSettingsSnapshot();
  }
  return DEFAULT_SETTINGS;
}

function getSupportedFontOptions(services: WordCloudServices): ReadonlyArray<{ value: string; label: string }> {
  if ('getSupportedFontFamilyOptions' in services && typeof services.getSupportedFontFamilyOptions === 'function') {
    return (services as WordCloudServices & FontOptionsProvider).getSupportedFontFamilyOptions();
  }
  return SUPPORTED_FONT_FAMILIES;
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

function createDefaultState(settings: Readonly<WordCloudSettings>): EmbedWizardState {
  return {
    cloudId: '',
    scope: 'file',
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
    render: { ...settings.render },
  };
}

export class EmbedWordCloudModal extends Modal {
  private readonly services: WordCloudServices;
  private readonly onInsert: (embedBlock: string) => boolean | Promise<boolean>;
  private readonly state: EmbedWizardState;
  private readonly settingsDefaults: Readonly<WordCloudSettings>;
  private readonly title: string;
  private readonly description: string;
  private readonly submitButtonText: string;

  private tabsEl!: HTMLDivElement;
  private filtersTabButtonEl!: HTMLButtonElement;
  private displayTabButtonEl!: HTMLButtonElement;
  private interactionsTabButtonEl!: HTMLButtonElement;
  private filtersPanelEl!: HTMLDivElement;
  private displayPanelEl!: HTMLDivElement;
  private interactionsPanelEl!: HTMLDivElement;
  private specificFileWrapperEl!: HTMLDivElement;
  private folderPathsWrapperEl!: HTMLDivElement;

  constructor(
    app: App,
    services: WordCloudServices,
    onInsert: (embedBlock: string) => boolean | Promise<boolean>,
    options: EmbedWordCloudModalOptions,
  ) {
    super(app);
    this.services = services;
    this.onInsert = onInsert;
    this.title = options.mode === 'edit' ? t('ui.blocks.embed.editTitle') : t('ui.modals.embed.title');
    this.description = options.mode === 'edit' ? t('ui.blocks.embed.editDescription') : t('ui.modals.embed.description');
    this.submitButtonText = options.mode === 'edit' ? t('ui.modals.embed.apply') : t('ui.modals.embed.insert');
    this.settingsDefaults = getSettingsDefaults(services);

    const defaultState = createDefaultState(this.settingsDefaults);
    const initialState = options.initialState ?? {};
    this.state = {
      ...defaultState,
      ...initialState,
      render: {
        ...defaultState.render,
        ...(initialState.render ?? {}),
      },
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

    contentEl.createEl('h2', { text: this.title });
    contentEl.createEl('p', {
      cls: 'word-cloud-embed-wizard-description',
      text: this.description,
    });

    const settingsShellEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-settings' });

    this.tabsEl = settingsShellEl.createDiv({ cls: 'word-cloud-embed-wizard-tabs' });
    this.tabsEl.setAttr('role', 'tablist');
    this.tabsEl.setAttr('aria-label', t('ui.modals.embed.tabs.ariaLabel'));

    this.filtersTabButtonEl = this.buildTabButton('filters', t('ui.modals.embed.tabs.filters'), true);
    this.displayTabButtonEl = this.buildTabButton('display', t('ui.modals.embed.tabs.display'), false);
    this.interactionsTabButtonEl = this.buildTabButton('interactions', t('ui.modals.embed.tabs.interactions'), false);

    const panelsEl = settingsShellEl.createDiv({ cls: 'word-cloud-embed-wizard-panels' });

    this.filtersPanelEl = panelsEl.createDiv({ cls: 'word-cloud-embed-wizard-panel is-active' });
    this.filtersPanelEl.id = 'word-cloud-embed-wizard-panel-filters';
    this.filtersPanelEl.setAttr('role', 'tabpanel');
    this.filtersPanelEl.setAttr('aria-labelledby', this.filtersTabButtonEl.id);

    this.displayPanelEl = panelsEl.createDiv({ cls: 'word-cloud-embed-wizard-panel' });
    this.displayPanelEl.id = 'word-cloud-embed-wizard-panel-display';
    this.displayPanelEl.setAttr('role', 'tabpanel');
    this.displayPanelEl.setAttr('aria-labelledby', this.displayTabButtonEl.id);

    this.interactionsPanelEl = panelsEl.createDiv({ cls: 'word-cloud-embed-wizard-panel' });
    this.interactionsPanelEl.id = 'word-cloud-embed-wizard-panel-interactions';
    this.interactionsPanelEl.setAttr('role', 'tabpanel');
    this.interactionsPanelEl.setAttr('aria-labelledby', this.interactionsTabButtonEl.id);

    this.renderFiltersPanel();
    this.renderDisplayPanel();
    this.renderInteractionsPanel();

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
    this.switchTab('filters');
    applyButton.buttonEl.focus();
  }

  onClose(): void {
    this.modalEl.removeClass('word-cloud-embed-wizard-modal');
    this.contentEl.empty();
  }

  private renderFiltersPanel(): void {
    new Setting(this.filtersPanelEl)
      .setName(t('ui.modals.embed.scope.name'))
      .setDesc(t('ui.modals.embed.scope.desc'))
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

    this.specificFileWrapperEl = this.filtersPanelEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });
    this.renderSpecificFileSetting();

    this.folderPathsWrapperEl = this.filtersPanelEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });
    new Setting(this.folderPathsWrapperEl)
      .setName(t('ui.modals.embed.folderPaths.name'))
      .setDesc(t('ui.modals.embed.folderPaths.desc'))
      .addText((text) => {
        text
          .setPlaceholder(t('ui.modals.embed.folderPaths.placeholder'))
          .setValue(this.state.folderPathsRaw)
          .onChange((value) => {
            this.state.folderPathsRaw = value;
          });
      });

    new Setting(this.filtersPanelEl)
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

    new Setting(this.filtersPanelEl)
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

    new Setting(this.filtersPanelEl)
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

    new Setting(this.filtersPanelEl)
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

    new Setting(this.filtersPanelEl)
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

    new Setting(this.filtersPanelEl)
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

    new Setting(this.filtersPanelEl)
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

    new Setting(this.filtersPanelEl)
      .setName(t('settings.tab.filters.minimumWordLength.name'))
      .setDesc(t('settings.tab.filters.minimumWordLength.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(1, 32, 1)
          .setValue(this.state.minWordLength)
          .setDynamicTooltip()
          .onChange((value) => {
            this.state.minWordLength = value;
          });
      });

    new Setting(this.filtersPanelEl)
      .setName(t('settings.tab.filters.nlp.enabled.name'))
      .setDesc(t('settings.tab.filters.nlp.enabled.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(this.state.nlpEnabled)
          .onChange((value) => {
            this.state.nlpEnabled = value;
            if (value && this.state.nlpMode === 'off') {
              this.state.nlpMode = 'light';
            }
            this.renderFiltersPanelRefresh();
          });
      });

    this.renderFiltersPanelRefresh();
  }

  private renderFiltersPanelRefresh(): void {
    this.filtersPanelEl.querySelectorAll('.word-cloud-embed-wizard-filter-nlp').forEach((el) => el.remove());

    const nlpContainer = this.filtersPanelEl.createDiv({ cls: 'word-cloud-embed-wizard-filter-nlp' });

    new Setting(nlpContainer)
      .setName(t('settings.tab.filters.nlp.mode.name'))
      .setDesc(t('settings.tab.filters.nlp.mode.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('off', t('settings.tab.filters.nlp.mode.off'))
          .addOption('light', t('settings.tab.filters.nlp.mode.light'))
          .addOption('aggressive', t('settings.tab.filters.nlp.mode.aggressive'))
          .setValue(this.state.nlpMode)
          .setDisabled(!this.state.nlpEnabled)
          .onChange((value) => {
            this.state.nlpMode = value === 'light' || value === 'aggressive' ? value : 'off';
          });
      });

    new Setting(nlpContainer)
      .setName(t('settings.tab.filters.nlp.preserveAcronyms.name'))
      .setDesc(t('settings.tab.filters.nlp.preserveAcronyms.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(this.state.preserveAcronyms)
          .setDisabled(!this.state.nlpEnabled)
          .onChange((value) => {
            this.state.preserveAcronyms = value;
          });
      });

    new Setting(nlpContainer)
      .setName(t('settings.tab.filters.nlp.minLemmaLength.name'))
      .setDesc(t('settings.tab.filters.nlp.minLemmaLength.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(2, 32, 1)
          .setValue(this.state.minLemmaLength)
          .setDynamicTooltip()
          .setDisabled(!this.state.nlpEnabled)
          .onChange((value) => {
            this.state.minLemmaLength = value;
          });
      });

    new Setting(nlpContainer)
      .setName(t('settings.tab.filters.nlp.filterNumericTokens.name'))
      .setDesc(t('settings.tab.filters.nlp.filterNumericTokens.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(this.state.filterNumericTokens)
          .setDisabled(!this.state.nlpEnabled)
          .onChange((value) => {
            this.state.filterNumericTokens = value;
          });
      });
  }

  private renderDisplayPanel(): void {
    new Setting(this.displayPanelEl)
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

    new Setting(this.displayPanelEl)
      .setName(t('settings.tab.render.fontFamily.name'))
      .setDesc(t('settings.tab.render.fontFamily.desc'))
      .addDropdown((dropdown) => {
        for (const font of getSupportedFontOptions(this.services)) {
          dropdown.addOption(font.value, getFontLabel(font.value, font.label));
        }
        dropdown
          .setValue(this.state.render.fontFamily)
          .onChange((value) => {
            this.state.render.fontFamily = value;
          });
      });

    new Setting(this.displayPanelEl)
      .setName(t('settings.tab.render.wordCaseMode.name'))
      .setDesc(t('settings.tab.render.wordCaseMode.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('lowercase', t('settings.tab.render.wordCaseMode.lowercase'))
          .addOption('normalized', t('settings.tab.render.wordCaseMode.normalized'))
          .setValue(this.state.render.wordCaseMode)
          .onChange((value) => {
            this.state.render.wordCaseMode = value === 'normalized' ? 'normalized' : 'lowercase';
          });
      });

    new Setting(this.displayPanelEl)
      .setName(t('settings.tab.render.showCount.name'))
      .setDesc(t('settings.tab.render.showCount.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(this.state.render.showCountInWordText)
          .onChange((value) => {
            this.state.render.showCountInWordText = value;
          });
      });

    new Setting(this.displayPanelEl)
      .setName(t('settings.tab.render.rotation.name'))
      .setDesc(t('settings.tab.render.rotation.desc'))
      .addDropdown((dropdown) => {
        for (const preset of ROTATION_PRESETS) {
          dropdown.addOption(preset, this.rotationPresetLabel(preset));
        }
        dropdown
          .setValue(this.state.render.rotationPreset)
          .onChange((value) => {
            this.state.render.rotationPreset = (ROTATION_PRESETS.includes(value as RotationPreset)
              ? value
              : 'mostly-horizontal') as RotationPreset;
          });
      });

    new Setting(this.displayPanelEl)
      .setName(t('settings.tab.render.spiral.name'))
      .setDesc(t('settings.tab.render.spiral.desc'))
      .addDropdown((dropdown) => {
        for (const spiral of SPIRAL_TYPES) {
          dropdown.addOption(spiral, this.spiralLabel(spiral));
        }
        dropdown
          .setValue(this.state.render.spiral)
          .onChange((value) => {
            this.state.render.spiral = (SPIRAL_TYPES.includes(value as SpiralType)
              ? value
              : 'archimedean') as SpiralType;
          });
      });

    new Setting(this.displayPanelEl)
      .setName(t('settings.tab.render.wordPadding.name'))
      .setDesc(t('settings.tab.render.wordPadding.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(0, 12, 1)
          .setValue(this.state.render.wordPadding)
          .setDynamicTooltip()
          .onChange((value) => {
            this.state.render.wordPadding = value;
          });
      });

    new Setting(this.displayPanelEl)
      .setName(t('settings.tab.render.fontSizeRange.name'))
      .setDesc(t('settings.tab.render.fontSizeRange.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(8, 64, 1)
          .setValue(this.state.render.minFontSize)
          .setDynamicTooltip()
          .onChange((value) => {
            this.state.render.minFontSize = Math.min(value, this.state.render.maxFontSize);
          });
      })
      .addSlider((slider) => {
        slider
          .setLimits(16, 140, 1)
          .setValue(this.state.render.maxFontSize)
          .setDynamicTooltip()
          .onChange((value) => {
            this.state.render.maxFontSize = Math.max(value, this.state.render.minFontSize);
          });
      });

    new Setting(this.displayPanelEl)
      .setName(t('settings.tab.render.scalingMode.name'))
      .setDesc(t('settings.tab.render.scalingMode.desc'))
      .addDropdown((dropdown) => {
        for (const mode of SCALING_MODES) {
          dropdown.addOption(mode, this.scalingModeLabel(mode));
        }
        dropdown
          .setValue(this.state.render.scalingMode)
          .onChange((value) => {
            this.state.render.scalingMode = (SCALING_MODES.includes(value as ScalingMode)
              ? value
              : 'power') as ScalingMode;
            this.renderDisplayPanelRefresh();
          });
      });

    this.renderDisplayPanelRefresh();
  }

  private renderDisplayPanelRefresh(): void {
    this.displayPanelEl.querySelectorAll('.word-cloud-embed-wizard-display-extra').forEach((el) => el.remove());
    const extraContainer = this.displayPanelEl.createDiv({ cls: 'word-cloud-embed-wizard-display-extra' });

    new Setting(extraContainer)
      .setName(t('settings.tab.render.scalingEmphasis.name'))
      .setDesc(t('settings.tab.render.scalingEmphasis.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(0.5, 3, 0.1)
          .setValue(this.state.render.emphasis)
          .setDynamicTooltip()
          .setDisabled(this.state.render.scalingMode !== 'power')
          .onChange((value) => {
            this.state.render.emphasis = value;
          });
      });

    new Setting(extraContainer)
      .setName(t('settings.tab.render.deterministicLayout.name'))
      .setDesc(t('settings.tab.render.deterministicLayout.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(this.state.render.deterministicLayout)
          .onChange((value) => {
            this.state.render.deterministicLayout = value;
            this.renderDisplayPanelRefresh();
          });
      })
      .addText((text) => {
        text
          .setPlaceholder(t('settings.tab.render.deterministicLayout.seedPlaceholder'))
          .setValue(String(this.state.render.randomSeed))
          .setDisabled(!this.state.render.deterministicLayout)
          .onChange((value) => {
            const parsed = Number.parseInt(value, 10);
            if (!Number.isNaN(parsed)) {
              this.state.render.randomSeed = Math.max(1, parsed);
            }
          });
      });
  }

  private renderInteractionsPanel(): void {
    new Setting(this.interactionsPanelEl)
      .setName(t('settings.tab.render.mouseInteractions.name'))
      .setDesc(t('settings.tab.render.mouseInteractions.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(this.state.render.enableMouseInteractions)
          .onChange((value) => {
            this.state.render.enableMouseInteractions = value;
          });
      });

    new Setting(this.interactionsPanelEl)
      .setName(t('settings.tab.render.clickToSearch.name'))
      .setDesc(t('settings.tab.render.clickToSearch.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(this.state.render.enableWordClickSearch)
          .onChange((value) => {
            this.state.render.enableWordClickSearch = value;
          });
      });

    new Setting(this.interactionsPanelEl)
      .setName(t('settings.tab.render.controls.name'))
      .setDesc(t('settings.tab.render.controls.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(this.state.render.enableControls)
          .onChange((value) => {
            this.state.render.enableControls = value;
          });
      });

    new Setting(this.interactionsPanelEl)
      .setName(t('settings.tab.render.exporting.name'))
      .setDesc(t('settings.tab.render.exporting.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(this.state.render.enableExporting)
          .onChange((value) => {
            this.state.render.enableExporting = value;
          });
      });
  }

  private renderSpecificFileSetting(): void {
    this.specificFileWrapperEl.empty();

    const filePaths = this.app.vault
      .getMarkdownFiles()
      .map((file) => file.path)
      .sort((a, b) => a.localeCompare(b));
    const hasCurrent = filePaths.includes(this.state.specificFilePath);

    new Setting(this.specificFileWrapperEl)
      .setName(t('ui.modals.embed.file.name'))
      .setDesc(t('ui.modals.embed.file.desc'))
      .addDropdown((dropdown) => {
        dropdown.addOption('', t('ui.modals.embed.file.currentNote'));
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
    const tabs: EmbedSettingsTab[] = ['filters', 'display', 'interactions'];
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
    const showDisplay = tab === 'display';
    const showInteractions = tab === 'interactions';

    this.filtersTabButtonEl.toggleClass('is-active', showFilters);
    this.filtersTabButtonEl.setAttr('aria-selected', showFilters ? 'true' : 'false');
    this.filtersTabButtonEl.setAttr('tabindex', showFilters ? '0' : '-1');

    this.displayTabButtonEl.toggleClass('is-active', showDisplay);
    this.displayTabButtonEl.setAttr('aria-selected', showDisplay ? 'true' : 'false');
    this.displayTabButtonEl.setAttr('tabindex', showDisplay ? '0' : '-1');

    this.interactionsTabButtonEl.toggleClass('is-active', showInteractions);
    this.interactionsTabButtonEl.setAttr('aria-selected', showInteractions ? 'true' : 'false');
    this.interactionsTabButtonEl.setAttr('tabindex', showInteractions ? '0' : '-1');

    this.filtersPanelEl.toggleClass('is-active', showFilters);
    this.displayPanelEl.toggleClass('is-active', showDisplay);
    this.interactionsPanelEl.toggleClass('is-active', showInteractions);

    const targetButton = showFilters
      ? this.filtersTabButtonEl
      : showDisplay
        ? this.displayTabButtonEl
        : this.interactionsTabButtonEl;

    if (document.activeElement && this.tabsEl.contains(document.activeElement)) {
      targetButton.focus();
    }
  }

  private rotationPresetLabel(value: RotationPreset): string {
    if (value === 'horizontal') {
      return t('settings.tab.render.rotation.horizontal');
    }
    if (value === 'mixed') {
      return t('settings.tab.render.rotation.mixed');
    }
    if (value === 'vertical') {
      return t('settings.tab.render.rotation.vertical');
    }
    return t('settings.tab.render.rotation.mostlyHorizontal');
  }

  private spiralLabel(value: SpiralType): string {
    return value === 'rectangular'
      ? t('settings.tab.render.spiral.rectangular')
      : t('settings.tab.render.spiral.archimedean');
  }

  private scalingModeLabel(value: ScalingMode): string {
    if (value === 'linear') {
      return t('settings.tab.render.scalingMode.linear');
    }
    if (value === 'log') {
      return t('settings.tab.render.scalingMode.log');
    }
    if (value === 'rank') {
      return t('settings.tab.render.scalingMode.rank');
    }
    return t('settings.tab.render.scalingMode.power');
  }

  private buildEmbedBlock(): string {
    const data: Record<string, string> = {};

    data.scope = this.state.scope;
    data.size = this.state.size;

    const includeTags = parseTagList(this.state.includeTagsRaw);
    const excludeTags = parseTagList(this.state.excludeTagsRaw).filter((tag) => !includeTags.includes(tag));
    const folderPaths = parseList(this.state.folderPathsRaw);
    const frontmatterRules = parseFrontmatterRules(this.state.frontmatterRulesRaw);
    const minCount = parseCount(this.state.minCountRaw, this.settingsDefaults.filters.frequency.minCount);
    const maxCount = parseCount(this.state.maxCountRaw, this.settingsDefaults.filters.frequency.maxCount);
    const excludeWords = parseWordList(this.state.excludeWordsRaw);
    const specificFilePath = this.state.specificFilePath.trim();

    if (this.state.scope === 'file') {
      const defaultFilePath = this.settingsDefaults.filters.scope.activeFilePath ?? '';
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

    if (this.state.tagMatchMode !== this.settingsDefaults.filters.tagMatchMode) {
      data['tag-match'] = this.state.tagMatchMode;
    }

    if (!areFrontmatterRulesEqual(frontmatterRules, this.settingsDefaults.filters.frontmatterRules)) {
      data['frontmatter-rules'] = frontmatterRules.map(serializeFrontmatterRule).join('; ');
    }

    if (minCount !== this.settingsDefaults.filters.frequency.minCount) {
      data['min-count'] = String(minCount);
    }
    if (maxCount !== this.settingsDefaults.filters.frequency.maxCount) {
      data['max-count'] = String(maxCount);
    }

    if (excludeWords.length > 0) {
      data['exclude-words'] = excludeWords.join(', ');
    }

    if (this.state.minWordLength !== this.settingsDefaults.filters.minWordLength) {
      data['min-word-length'] = String(this.state.minWordLength);
    }

    if (this.state.nlpEnabled !== this.settingsDefaults.filters.nlp.enabled) {
      data['nlp-enabled'] = String(this.state.nlpEnabled);
    }
    if (this.state.nlpMode !== this.settingsDefaults.filters.nlp.mode) {
      data['nlp-mode'] = this.state.nlpMode;
    }
    if (this.state.preserveAcronyms !== this.settingsDefaults.filters.nlp.preserveAcronyms) {
      data['nlp-preserve-acronyms'] = String(this.state.preserveAcronyms);
    }
    if (this.state.minLemmaLength !== this.settingsDefaults.filters.nlp.minLemmaLength) {
      data['nlp-min-lemma-length'] = String(this.state.minLemmaLength);
    }
    if (this.state.filterNumericTokens !== this.settingsDefaults.filters.nlp.filterNumericTokens) {
      data['nlp-filter-numeric-tokens'] = String(this.state.filterNumericTokens);
    }

    this.appendRenderOverridesToData(data);

    const dataEncoded = btoa(JSON.stringify(data));

    return `\`\`\`wordcloud
id: ${this.state.cloudId}
data: ${dataEncoded}
\`\`\``;
  }

  private appendRenderOverridesToData(data: Record<string, string>): void {
    const defaults = this.settingsDefaults.render;
    const render = this.state.render;

    if (render.rotationPreset !== defaults.rotationPreset) {
      data['rotation-preset'] = render.rotationPreset;
    }
    if (render.spiral !== defaults.spiral) {
      data.spiral = render.spiral;
    }
    if (render.wordPadding !== defaults.wordPadding) {
      data['word-padding'] = String(render.wordPadding);
    }
    if (render.minFontSize !== defaults.minFontSize) {
      data['min-font-size'] = String(render.minFontSize);
    }
    if (render.maxFontSize !== defaults.maxFontSize) {
      data['max-font-size'] = String(render.maxFontSize);
    }
    if (render.fontFamily !== defaults.fontFamily) {
      data['font-family'] = render.fontFamily;
    }
    if (render.scalingMode !== defaults.scalingMode) {
      data['scaling-mode'] = render.scalingMode;
    }
    if (render.emphasis !== defaults.emphasis) {
      data.emphasis = String(render.emphasis);
    }
    if (render.showCountInWordText !== defaults.showCountInWordText) {
      data['show-count-in-word-text'] = String(render.showCountInWordText);
    }
    if (render.wordCaseMode !== defaults.wordCaseMode) {
      data['word-case-mode'] = render.wordCaseMode;
    }
    if (render.deterministicLayout !== defaults.deterministicLayout) {
      data['deterministic-layout'] = String(render.deterministicLayout);
    }
    if (render.randomSeed !== defaults.randomSeed) {
      data['random-seed'] = String(render.randomSeed);
    }
    if (render.enableMouseInteractions !== defaults.enableMouseInteractions) {
      data['enable-mouse-interactions'] = String(render.enableMouseInteractions);
    }
    if (render.enableWordClickSearch !== defaults.enableWordClickSearch) {
      data['enable-click-to-search'] = String(render.enableWordClickSearch);
    }
    if (render.enableControls !== defaults.enableControls) {
      data['enable-controls'] = String(render.enableControls);
    }
    if (render.enableExporting !== defaults.enableExporting) {
      data['enable-exporting'] = String(render.enableExporting);
    }
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
