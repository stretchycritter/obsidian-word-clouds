import type { Plugin } from 'obsidian';
import { PluginSettingTab, Setting, setIcon } from 'obsidian';
import type {
  DefaultScopeOnInsert,
  PerformanceMode,
  RenderSettings,
  RotationPreset,
  ScalingMode,
  SpiralType,
} from '@/settings/types';
import type { VaultCollectionOptions, WordCloudServices } from '@/services/types';
import type { WordCloudSettingsControls } from '@/services/wordcloud-services';
import { renderWordCloudCanvas } from '@/core';
import { t } from '@/i18n';
import { renderFilterSettingsPanel } from '@/ui/components/filter-settings-panel';

type SettingsTabServices = WordCloudServices & WordCloudSettingsControls;
type PerformanceModeRunResult = {
  mode: PerformanceMode;
  message: string;
};
type BenchmarkCollectionOptions = Omit<VaultCollectionOptions, 'renderSettingsOverride' | 'excludeWords'>;

const GITHUB_ISSUE_BASE_URL = 'https://github.com/stretchycritter/obsidian-word-clouds/issues/new';
const BUG_REPORT_ISSUE_URL = `${GITHUB_ISSUE_BASE_URL}?template=bug_report.yml`;
const FEATURE_REQUEST_ISSUE_URL = `${GITHUB_ISSUE_BASE_URL}?template=feature_request.yml`;
const BENCHMARK_MODES: PerformanceMode[] = ['full-speed', 'balanced', 'throttled'];
declare const __DEV_BUILD__: boolean;

function formatT(key: string, replacements: Record<string, string | number>): string {
  let value = t(key);
  for (const [token, replacement] of Object.entries(replacements)) {
    value = value.replace(`{${token}}`, String(replacement));
  }
  return value;
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

export class VaultWordCloudSettingTab extends PluginSettingTab {
  private readonly services: SettingsTabServices;
  private isBenchmarkRunInProgress = false;
  private benchmarkResults: PerformanceModeRunResult[] = [];

  constructor(plugin: Plugin, services: SettingsTabServices) {
    super(plugin.app, plugin);
    this.services = services;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    const contentEl = containerEl.createDiv({ cls: 'vault-word-cloud-settings-tab' });
    const settings = this.services.getSettingsSnapshot();

    const createSection = (headingKey: string, descKey?: string): HTMLElement => {
      const sectionEl = contentEl.createDiv({ cls: 'vault-word-cloud-settings-section' });
      sectionEl.createEl('h3', { text: t(headingKey) });
      if (descKey) {
        sectionEl.createEl('p', {
          cls: 'vault-word-cloud-settings-section-desc',
          text: t(descKey),
        });
      }
      return sectionEl;
    };

    const createSubSection = (parentEl: HTMLElement, headingKey: string): HTMLElement => {
      const subEl = parentEl.createDiv({ cls: 'vault-word-cloud-settings-subsection' });
      subEl.createEl('h4', { text: t(headingKey) });
      return subEl;
    };

    const renderExclusionListBlock = (sectionEl: HTMLElement): void => {
      const sortedWords = settings.exclusionListWords;
      const blockEl = sectionEl.createDiv({ cls: 'vault-word-cloud-settings-exclusion-block' });

      let draftWord = '';
      const submitDraftWord = async (): Promise<void> => {
        const added = await this.services.addExclusionListWord(draftWord);
        if (added) {
          this.display();
        }
      };

      new Setting(blockEl)
        .setName(t('settings.tab.filters.addExcludedWord.name'))
        .setDesc(t('settings.tab.filters.addExcludedWord.desc'))
        .addText((text) => {
          text.setPlaceholder(t('settings.tab.filters.addExcludedWord.placeholder'));
          text.onChange((value) => {
            draftWord = value;
          });

          text.inputEl.addEventListener('keydown', async (event) => {
            if (event.key !== 'Enter') {
              return;
            }

            event.preventDefault();
            await submitDraftWord();
          });
        })
        .addButton((button) => {
          button.setButtonText(t('settings.tab.filters.addExcludedWord.button')).setCta().onClick(async () => {
            await submitDraftWord();
          });
        });

      const listEl = blockEl.createDiv({ cls: 'vault-word-cloud-settings-badges' });

      if (sortedWords.length === 0) {
        listEl.createSpan({ cls: 'vault-word-cloud-settings-badges-empty', text: t('settings.tab.filters.excludedWords.empty') });
      } else {
        for (const word of sortedWords) {
          const badgeEl = listEl.createDiv({ cls: 'vault-word-cloud-settings-badge' });
          badgeEl.createSpan({ cls: 'vault-word-cloud-settings-badge-text', text: word });

          const removeButton = badgeEl.createEl('button', {
            cls: 'vault-word-cloud-settings-badge-remove clickable-icon',
          });
          setIcon(removeButton, 'x');
          removeButton.type = 'button';
          removeButton.setAttr('aria-label', formatT('settings.tab.filters.excludedWords.removeAria', { word }));
          removeButton.setAttr('data-tooltip-position', 'top');
          removeButton.setAttr('data-tooltip', formatT('settings.tab.filters.excludedWords.removeTooltip', { word }));
          removeButton.addEventListener('click', async () => {
            await this.services.removeExclusionListWord(word);
            this.display();
          });
        }
      }
    };

    const renderFiltersSection = (sectionEl: HTMLElement): void => {
      renderFilterSettingsPanel(
        sectionEl,
        {
          minWordLength: settings.filters.minWordLength,
          nlp: { ...settings.filters.nlp },
        },
        {
          onMinWordLengthChange: async (value) => {
            await this.services.updateFilterSettings({ minWordLength: value });
          },
          onNlpSettingsChange: async (nlp) => {
            await this.services.updateFilterSettings({ nlp });
          },
        },
      );
    };

    // ── Global Settings ─────────────────────────────────────────────────────

    const globalSectionEl = createSection('settings.tab.global.heading', 'settings.tab.global.desc');

    new Setting(globalSectionEl)
      .setName(t('settings.tab.global.openEditorOnInsert.name'))
      .setDesc(t('settings.tab.global.openEditorOnInsert.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.openEditorOnInsert)
          .onChange(async (value) => {
            await this.services.updateOpenEditorOnInsert(value);
          });
      });

    new Setting(globalSectionEl)
      .setName(t('settings.tab.global.defaultScopeOnInsert.name'))
      .setDesc(t('settings.tab.global.defaultScopeOnInsert.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('file', t('settings.tab.global.defaultScopeOnInsert.file'))
          .addOption('vault', t('settings.tab.global.defaultScopeOnInsert.vault'))
          .setValue(settings.defaultScopeOnInsert)
          .onChange(async (value) => {
            await this.services.updateDefaultScopeOnInsert(value as DefaultScopeOnInsert);
          });
      });

    renderExclusionListBlock(globalSectionEl);

    // ── Filters ──────────────────────────────────────────────────────────────

    const filtersSectionEl = createSection('settings.tab.filters.heading');
    renderFiltersSection(filtersSectionEl);

    // ── Wordcloud Defaults ───────────────────────────────────────────────────

    const defaultsSectionEl = createSection('settings.tab.defaults.heading', 'settings.tab.defaults.desc');
    const layoutSectionEl = createSubSection(defaultsSectionEl, 'settings.tab.render.heading');
    let previewCanvasEl!: HTMLDivElement;

    const previewNonce = { value: 0 };
    const rerenderPreview = async (): Promise<void> => {
      await renderWordCloudCanvas({
        nonceRef: previewNonce,
        containerEl: previewCanvasEl,
        preserveContainerDuringRender: true,
        services: this.services,
        errorLogPrefix: 'Word clouds settings preview',
        createStatusHandle: (initialText, targetEl) => {
          const renderTargetEl = targetEl ?? previewCanvasEl;
          const stateEl = renderTargetEl.createDiv({ cls: 'vault-word-cloud-state', text: initialText });
          return {
            setText: (text) => stateEl.setText(text),
            remove: () => stateEl.remove(),
          };
        },
        renderEmptyState: (message, targetEl) => {
          const renderTargetEl = targetEl ?? previewCanvasEl;
          renderTargetEl.createDiv({
            cls: 'vault-word-cloud-state',
            text: message,
          });
        },
        renderErrorState: (_message, targetEl) => {
          const renderTargetEl = targetEl ?? previewCanvasEl;
          renderTargetEl.createDiv({
            cls: 'vault-word-cloud-state',
            text: t('settings.tab.preview.renderError'),
          });
        },
        resolveScopeFilePath: () => '',
        resolveExtraContext: () => null,
        getAriaLabel: () => t('settings.tab.preview.ariaLabel'),
        getNoWordsMessage: () => t('settings.tab.preview.noWords'),
        getWords: async () => this.services.getSettingsPreviewWords(),
        getDrawOptions: () => ({
          enableViewportInteraction: false,
          enableWordClickSearch: false,
        }),
        onWordClick: () => {
          // no-op in settings preview
        },
        onRefresh: rerenderPreview,
      });
    };

    const updateRenderAndPreview = async (patch: Partial<RenderSettings>): Promise<void> => {
      await this.services.updateRenderSettings(patch);
      await rerenderPreview();
    };

    new Setting(layoutSectionEl)
      .setName(t('settings.tab.render.fontFamily.name'))
      .setDesc(t('settings.tab.render.fontFamily.desc'))
      .addDropdown((dropdown) => {
        for (const font of this.services.getSupportedFontFamilyOptions()) {
          dropdown.addOption(font.value, getFontLabel(font.value, font.label));
        }
        dropdown
          .setValue(this.services.getSelectedSupportedFontFamily(settings.render.fontFamily))
          .onChange(async (value) => {
            await updateRenderAndPreview({ fontFamily: value });
          });
      });

    new Setting(layoutSectionEl)
      .setName(t('settings.tab.render.wordCaseMode.name'))
      .setDesc(t('settings.tab.render.wordCaseMode.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('lowercase', t('settings.tab.render.wordCaseMode.lowercase'))
          .addOption('normalized', t('settings.tab.render.wordCaseMode.normalized'))
          .setValue(settings.render.wordCaseMode)
          .onChange(async (value) => {
            await updateRenderAndPreview({
              wordCaseMode: value === 'normalized' ? 'normalized' : 'lowercase',
            });
          });
      });

    new Setting(layoutSectionEl)
      .setName(t('settings.tab.render.showCount.name'))
      .setDesc(t('settings.tab.render.showCount.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.showCountInWordText)
          .onChange(async (value) => {
            await updateRenderAndPreview({ showCountInWordText: value });
          });
      });

    const previewWrapperEl = layoutSectionEl.createDiv({ cls: 'vault-word-cloud-settings-preview' });
    previewCanvasEl = previewWrapperEl.createDiv({ cls: 'vault-word-cloud-settings-preview-canvas' });

    new Setting(layoutSectionEl)
      .setName(t('settings.tab.render.rotation.name'))
      .setDesc(t('settings.tab.render.rotation.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('horizontal', t('settings.tab.render.rotation.horizontal'))
          .addOption('mostly-horizontal', t('settings.tab.render.rotation.mostlyHorizontal'))
          .addOption('mixed', t('settings.tab.render.rotation.mixed'))
          .addOption('vertical', t('settings.tab.render.rotation.vertical'))
          .setValue(settings.render.rotationPreset)
          .onChange(async (value) => {
            await updateRenderAndPreview({
              rotationPreset: value as RotationPreset,
            });
          });
      });

    new Setting(layoutSectionEl)
      .setName(t('settings.tab.render.spiral.name'))
      .setDesc(t('settings.tab.render.spiral.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('archimedean', t('settings.tab.render.spiral.archimedean'))
          .addOption('rectangular', t('settings.tab.render.spiral.rectangular'))
          .setValue(settings.render.spiral)
          .onChange(async (value) => {
            await updateRenderAndPreview({
              spiral: value as SpiralType,
            });
          });
      });

    new Setting(layoutSectionEl)
      .setName(t('settings.tab.render.wordPadding.name'))
      .setDesc(t('settings.tab.render.wordPadding.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(0, 12, 1)
          .setValue(settings.render.wordPadding)
          .setDynamicTooltip()
          .onChange(async (value) => {
            await updateRenderAndPreview({ wordPadding: value });
          });
      });

    new Setting(layoutSectionEl)
      .setName(t('settings.tab.render.fontSizeMin.name'))
      .setDesc(t('settings.tab.render.fontSizeMin.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(8, 64, 1)
          .setValue(settings.render.minFontSize)
          .setDynamicTooltip()
          .onChange(async (value) => {
            const nextRenderSettings = await this.services.updateMinimumFontSize(value);
            await rerenderPreview();
            if (nextRenderSettings.minFontSize !== value) {
              this.display();
            }
          });
      });

    new Setting(layoutSectionEl)
      .setName(t('settings.tab.render.fontSizeMax.name'))
      .setDesc(t('settings.tab.render.fontSizeMax.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(16, 140, 1)
          .setValue(settings.render.maxFontSize)
          .setDynamicTooltip()
          .onChange(async (value) => {
            const nextRenderSettings = await this.services.updateMaximumFontSize(value);
            await rerenderPreview();
            if (nextRenderSettings.maxFontSize !== value) {
              this.display();
            }
          });
      });

    const scalingModeSetting = new Setting(layoutSectionEl)
      .setName(t('settings.tab.render.scalingMode.name'))
      .setDesc(t('settings.tab.render.scalingMode.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('linear', t('settings.tab.render.scalingMode.linear'))
          .addOption('power', t('settings.tab.render.scalingMode.power'))
          .addOption('log', t('settings.tab.render.scalingMode.log'))
          .addOption('rank', t('settings.tab.render.scalingMode.rank'))
          .setValue(settings.render.scalingMode)
          .onChange(async (value) => {
            await updateRenderAndPreview({ scalingMode: value as ScalingMode });
            this.display();
          });
      });

    if (settings.render.scalingMode === 'power') {
      scalingModeSetting.addSlider((slider) => {
        slider
          .setLimits(0.5, 3, 0.1)
          .setValue(settings.render.emphasis)
          .setDynamicTooltip()
          .onChange(async (value) => {
            await updateRenderAndPreview({ emphasis: value });
          });
      });
    }

    const deterministicSetting = new Setting(layoutSectionEl)
      .setName(t('settings.tab.render.deterministicLayout.name'))
      .setDesc(t('settings.tab.render.deterministicLayout.desc'));

    if (settings.render.deterministicLayout) {
      deterministicSetting.addText((text) => {
        text.setPlaceholder(t('settings.tab.render.deterministicLayout.seedPlaceholder'));
        text
          .setValue(String(settings.render.randomSeed))
          .onChange(async (value) => {
            const parsed = Number.parseInt(value, 10);
            if (!Number.isNaN(parsed)) {
              await updateRenderAndPreview({ randomSeed: parsed });
            }
          });
      });
    }

    deterministicSetting.addToggle((toggle) => {
      toggle
        .setValue(settings.render.deterministicLayout)
        .onChange(async (value) => {
          await updateRenderAndPreview({ deterministicLayout: value });
          this.display();
        });
    });

    const interactionsSectionEl = createSubSection(defaultsSectionEl, 'settings.tab.interactions.heading');

    new Setting(interactionsSectionEl)
      .setName(t('settings.tab.render.mouseInteractions.name'))
      .setDesc(t('settings.tab.render.mouseInteractions.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.enableMouseInteractions)
          .onChange(async (value) => {
            await updateRenderAndPreview({ enableMouseInteractions: value });
          });
      });

    new Setting(interactionsSectionEl)
      .setName(t('settings.tab.render.clickToSearch.name'))
      .setDesc(t('settings.tab.render.clickToSearch.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.enableWordClickSearch)
          .onChange(async (value) => {
            await updateRenderAndPreview({ enableWordClickSearch: value });
          });
      });

    new Setting(interactionsSectionEl)
      .setName(t('settings.tab.render.controls.name'))
      .setDesc(t('settings.tab.render.controls.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.enableControls)
          .onChange(async (value) => {
            await updateRenderAndPreview({ enableControls: value });
          });
      });

    new Setting(interactionsSectionEl)
      .setName(t('settings.tab.render.exporting.name'))
      .setDesc(t('settings.tab.render.exporting.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.enableExporting)
          .onChange(async (value) => {
            await updateRenderAndPreview({ enableExporting: value });
          });
      });

    if (typeof __DEV_BUILD__ !== 'undefined' && __DEV_BUILD__) {
      const performanceSectionEl = createSection('settings.tab.performance.heading');

      new Setting(performanceSectionEl)
        .setName(t('settings.tab.performance.processingSpeed.name'))
        .setDesc(t('settings.tab.performance.processingSpeed.desc'))
        .addDropdown((dropdown) => {
          dropdown
            .addOption('full-speed', t('settings.tab.performance.processingSpeed.fullSpeed'))
            .addOption('balanced', t('settings.tab.performance.processingSpeed.balanced'))
            .addOption('throttled', t('settings.tab.performance.processingSpeed.throttled'))
            .setValue(settings.render.performanceMode)
            .onChange(async (value) => {
              await updateRenderAndPreview({ performanceMode: value as PerformanceMode });
            });
        });

      const benchmarkContainerEl = performanceSectionEl.createDiv({ cls: 'vault-word-cloud-settings-benchmark-container' });
      const benchmarkBlockEl = benchmarkContainerEl.createDiv({ cls: 'vault-word-cloud-settings-benchmark-block' });

      new Setting(benchmarkBlockEl)
        .setName(t('settings.tab.performance.benchmark.name'))
        .setDesc(t('settings.tab.performance.benchmark.desc'))
        .addButton((button) => {
          button
            .setButtonText(this.isBenchmarkRunInProgress
              ? t('settings.tab.performance.benchmark.buttonRunning')
              : t('settings.tab.performance.benchmark.button'))
            .setCta()
            .onClick(async () => {
              await this.runPerformanceModeBenchmarks();
            });
        });

      const benchmarkResultsContainerEl = benchmarkBlockEl.createDiv({
        cls: 'vault-word-cloud-settings-benchmark-results',
      });

      const benchmarkTableEl = benchmarkResultsContainerEl.createEl('table', {
        cls: 'vault-word-cloud-settings-benchmark-table',
      });
      const benchmarkHeaderEl = benchmarkTableEl.createEl('thead');
      const benchmarkHeaderRowEl = benchmarkHeaderEl.createEl('tr');
      benchmarkHeaderRowEl.createEl('th', { text: t('settings.tab.performance.benchmark.results.columns.mode') });
      benchmarkHeaderRowEl.createEl('th', { text: t('settings.tab.performance.benchmark.results.columns.result') });
      const benchmarkBodyEl = benchmarkTableEl.createEl('tbody');

      if (this.benchmarkResults.length === 0) {
        const rowEl = benchmarkBodyEl.createEl('tr');
        const cellEl = rowEl.createEl('td', { text: t('settings.tab.performance.benchmark.results.empty') });
        cellEl.setAttr('colspan', '2');
      } else {
        for (const result of this.benchmarkResults) {
          const rowEl = benchmarkBodyEl.createEl('tr');
          rowEl.createEl('td', { text: t(`settings.tab.performance.processingSpeed.${this.performanceModeLabelKey(result.mode)}`) });
          rowEl.createEl('td', { text: result.message });
        }
      }
    }

    const resetSectionEl = createSection('settings.tab.reset.heading');
    resetSectionEl.addClass('vault-word-cloud-settings-reset-wrapper');

    new Setting(resetSectionEl)
      .setDesc(t('settings.tab.reset.all.desc'))
      .addButton((button) => {
        button
          .setButtonText(t('settings.tab.reset.all.button'))
          .setWarning()
          .onClick(async () => {
            const confirmed = window.confirm(t('settings.tab.reset.all.confirm'));
            if (!confirmed) {
              return;
            }
            await this.services.resetAllSettings();
            this.display();
          });
      });

    const supportContainerEl = contentEl.createDiv({ cls: 'vault-word-cloud-settings-section vault-word-cloud-settings-support' });
    supportContainerEl.createEl('h3', {
      cls: 'vault-word-cloud-settings-support-title',
      text: t('settings.tab.support.title'),
    });
    supportContainerEl.createEl('p', {
      cls: 'vault-word-cloud-settings-support-copy',
      text: t('settings.tab.support.description'),
    });

    const supportButtonsEl = supportContainerEl.createDiv({ cls: 'vault-word-cloud-settings-support-actions' });

    const featureButtonEl = supportButtonsEl.createEl('button', {
      cls: 'mod-cta vault-word-cloud-settings-support-button vault-word-cloud-settings-support-button-feature',
      text: t('settings.tab.support.featureButton'),
    });
    featureButtonEl.type = 'button';
    featureButtonEl.setAttr('aria-label', t('settings.tab.support.featureButton'));
    featureButtonEl.addEventListener('click', () => {
      window.open(FEATURE_REQUEST_ISSUE_URL, '_blank', 'noopener,noreferrer');
    });

    const bugButtonEl = supportButtonsEl.createEl('button', {
      cls: 'vault-word-cloud-settings-support-button vault-word-cloud-settings-support-button-report',
      text: t('settings.tab.support.bugButton'),
    });
    bugButtonEl.type = 'button';
    bugButtonEl.setAttr('aria-label', t('settings.tab.support.bugButton'));
    bugButtonEl.addEventListener('click', () => {
      window.open(BUG_REPORT_ISSUE_URL, '_blank', 'noopener,noreferrer');
    });

    void rerenderPreview();
  }

  private async runPerformanceModeBenchmarks(): Promise<void> {
    if (this.isBenchmarkRunInProgress) {
      return;
    }

    this.isBenchmarkRunInProgress = true;
    this.benchmarkResults = BENCHMARK_MODES.map((mode) => ({
      mode,
      message: t('settings.tab.performance.benchmark.results.running'),
    }));
    this.display();

    const settings = this.services.getSettingsSnapshot();
    const benchmarkOptions = {
      sourceRules: {
        scope: { mode: 'vault' as const },
        includeTags: settings.filters.includeTags,
        excludeTags: settings.filters.excludeTags,
        tagMatchMode: settings.filters.tagMatchMode,
        frontmatterRules: settings.filters.frontmatterRules,
      },
      frequency: settings.filters.frequency,
      nlpSettings: settings.filters.nlp,
    };

    await this.runBenchmarkWarmup(settings.render.performanceMode, benchmarkOptions);

    const results: PerformanceModeRunResult[] = [];
    for (const mode of BENCHMARK_MODES) {
      results.push(await this.runPerformanceMode(mode, benchmarkOptions));
    }

    this.benchmarkResults = results;
    this.isBenchmarkRunInProgress = false;
    this.display();
  }

  private async runBenchmarkWarmup(
    mode: PerformanceMode,
    options: BenchmarkCollectionOptions,
  ): Promise<void> {
    try {
      await this.services.collectVaultWordsWithMetrics({
        ...options,
        renderSettingsOverride: {
          performanceMode: mode,
        },
      });
    } catch {
      // Ignore warm-up errors and continue to measured benchmark runs.
    }
  }

  private async runPerformanceMode(
    mode: PerformanceMode,
    options: BenchmarkCollectionOptions,
  ): Promise<PerformanceModeRunResult> {
    const startedAt = Date.now();

    try {
      const result = await this.services.collectVaultWordsWithMetrics({
        ...options,
        renderSettingsOverride: {
          performanceMode: mode,
        },
      });
      return {
        mode,
        message: formatT('settings.tab.performance.benchmark.results.success', {
          words: result.words.length,
          ms: result.metrics.collectionMs,
        }),
      };
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      return {
        mode,
        message: formatT('settings.tab.performance.benchmark.results.error', {
          ms: durationMs,
          message: this.formatErrorMessage(error),
        }),
      };
    }
  }

  private formatErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }
    return t('settings.tab.performance.benchmark.results.unknownError');
  }

  private performanceModeLabelKey(mode: PerformanceMode): 'fullSpeed' | 'balanced' | 'throttled' {
    if (mode === 'full-speed') {
      return 'fullSpeed';
    }
    if (mode === 'throttled') {
      return 'throttled';
    }
    return 'balanced';
  }
}
