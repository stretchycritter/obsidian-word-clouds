import type { Plugin } from 'obsidian';
import { PluginSettingTab, Setting, setIcon } from 'obsidian';
import type {
  DefaultScopeOnInsert,
  RenderSettings,
  RotationPreset,
  ScalingMode,
  SpiralType,
} from '@/settings/types';
import type { WordCloudServices } from '@/services/types';
import type { WordCloudSettingsControls } from '@/services/wordcloud-services';
import { renderWordCloudCanvas } from '@/core';
import { t, type TranslationKey } from '@/i18n';
import { renderFilterSettingsPanel } from '@/ui';
import {
  type PerformanceModeRunResult,
  BENCHMARK_MODES,
  formatT,
  getFontLabel,
  renderResetSection,
  renderSupportSection,
  renderPerformanceSection,
  executeBenchmarkRun,
} from './tab-sections';

type SettingsTabServices = WordCloudServices & WordCloudSettingsControls;
declare const __DEV_BUILD__: boolean;

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

    const createSection = (headingKey: TranslationKey, descKey?: TranslationKey): HTMLElement => {
      const sectionEl = contentEl.createDiv({ cls: 'vault-word-cloud-settings-section' });
      new Setting(sectionEl).setName(t(headingKey)).setHeading();
      if (descKey) {
        sectionEl.createEl('p', {
          cls: 'vault-word-cloud-settings-section-desc',
          text: t(descKey),
        });
      }
      return sectionEl;
    };

    const createSubSection = (parentEl: HTMLElement, headingKey: TranslationKey): HTMLElement => {
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
      renderPerformanceSection(
        contentEl,
        settings,
        this.isBenchmarkRunInProgress,
        this.benchmarkResults,
        updateRenderAndPreview,
        () => this.runPerformanceModeBenchmarks(),
      );
    }

    renderResetSection(contentEl, this.app, this.services, () => this.display());
    renderSupportSection(contentEl);

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

    this.benchmarkResults = await executeBenchmarkRun(this.services);
    this.isBenchmarkRunInProgress = false;
    this.display();
  }
}
