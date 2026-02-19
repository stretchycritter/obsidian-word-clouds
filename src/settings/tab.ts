import type { Plugin } from 'obsidian';
import { PluginSettingTab, Setting, setIcon } from 'obsidian';
import type {
  PerformanceMode,
  RenderSettings,
  RotationPreset,
  ScalingMode,
  SpiralType,
} from '@/settings/types';
import type { WordCloudServices } from '@/services/types';
import type { WordCloudSettingsControls } from '@/services/wordcloud-services';
import { renderWordCloudCanvas } from '@/ui';
import { t } from '@/i18n';

type SettingsTabServices = WordCloudServices & WordCloudSettingsControls;

const GITHUB_ISSUE_BASE_URL = 'https://github.com/stretchycritter/obsidian-word-clouds/issues/new';
const BUG_REPORT_ISSUE_URL = `${GITHUB_ISSUE_BASE_URL}?template=bug_report.yml`;
const FEATURE_REQUEST_ISSUE_URL = `${GITHUB_ISSUE_BASE_URL}?template=feature_request.yml`;

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
  private isExcludedWordsExpanded = false;

  constructor(plugin: Plugin, services: SettingsTabServices) {
    super(plugin.app, plugin);
    this.services = services;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: t('settings.tab.title') });
    const settings = this.services.getSettingsSnapshot();

    const renderFiltersSection = (): void => {
      containerEl.createEl('h3', { text: t('settings.tab.filters.heading') });

      let draftWord = '';
      const submitDraftWord = async (): Promise<void> => {
        const added = await this.services.addExclusionListWord(draftWord);
        if (added) {
          this.display();
        }
      };

      new Setting(containerEl)
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

      const sortedWords = settings.exclusionListWords;
      const excludedWordsDetailsEl = containerEl.createEl('details', {
        cls: 'vault-word-cloud-settings-excluded-details',
      });
      excludedWordsDetailsEl.open = this.isExcludedWordsExpanded;
      excludedWordsDetailsEl.addEventListener('toggle', () => {
        this.isExcludedWordsExpanded = excludedWordsDetailsEl.open;
      });

      const excludedWordsSummaryEl = excludedWordsDetailsEl.createEl('summary', {
        cls: 'vault-word-cloud-settings-excluded-summary',
      });
      excludedWordsSummaryEl.setText(formatT('settings.tab.filters.excludedWords.summary', { count: sortedWords.length }));

      const listWrapperEl = excludedWordsDetailsEl.createDiv({ cls: 'vault-word-cloud-settings-list' });
      const listEl = listWrapperEl.createDiv({ cls: 'vault-word-cloud-settings-badges' });

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

    containerEl.createEl('h3', { text: t('settings.tab.render.heading') });
    containerEl.createEl('p').createEl('em', {
      text: t('settings.tab.render.description'),
    });

    const previewWrapperEl = containerEl.createDiv({ cls: 'vault-word-cloud-settings-preview' });
    const previewCanvasEl = previewWrapperEl.createDiv({ cls: 'vault-word-cloud-settings-preview-canvas' });

    const previewNonce = { value: 0 };
    const rerenderPreview = async (): Promise<void> => {
      await renderWordCloudCanvas({
        nonceRef: previewNonce,
        containerEl: previewCanvasEl,
        services: this.services,
        errorLogPrefix: 'Word clouds settings preview',
        createStatusHandle: (initialText) => {
          const stateEl = previewCanvasEl.createDiv({ cls: 'vault-word-cloud-state', text: initialText });
          return {
            setText: (text) => stateEl.setText(text),
            remove: () => stateEl.remove(),
          };
        },
        renderEmptyState: (message) => {
          previewCanvasEl.createDiv({
            cls: 'vault-word-cloud-state',
            text: message,
          });
        },
        renderErrorState: (_message) => {
          previewCanvasEl.createDiv({
            cls: 'vault-word-cloud-state',
            text: t('settings.tab.preview.renderError'),
          });
        },
        resolveScopeFilePath: () => '',
        resolveExtraContext: () => null,
        getAriaLabel: () => t('settings.tab.preview.ariaLabel'),
        getNoWordsMessage: () => t('settings.tab.preview.noWords'),
        getWords: async () => this.services.getSettingsPreviewWords(),
        onWordClick: () => {
          // no-op in settings preview
        },
        getDrawOptions: () => ({
          enableExport: false,
        }),
        onRefresh: rerenderPreview,
      });
    };

    const updateRenderAndPreview = async (patch: Partial<RenderSettings>): Promise<void> => {
      await this.services.updateRenderSettings(patch);
      await rerenderPreview();
    };

    new Setting(containerEl)
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

    new Setting(containerEl)
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

    new Setting(containerEl)
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

    new Setting(containerEl)
      .setName(t('settings.tab.render.fontSizeRange.name'))
      .setDesc(t('settings.tab.render.fontSizeRange.desc'))
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
      })
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

    new Setting(containerEl)
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

    new Setting(containerEl)
      .setName(t('settings.tab.render.showCount.name'))
      .setDesc(t('settings.tab.render.showCount.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.showCountInWordText)
          .onChange(async (value) => {
            await updateRenderAndPreview({ showCountInWordText: value });
            this.display();
          });
      });

    new Setting(containerEl)
      .setName(t('settings.tab.render.metricToggle.name'))
      .setDesc(t('settings.tab.render.metricToggle.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.showWordTextMetricToggle)
          .setDisabled(!settings.render.showCountInWordText)
          .onChange(async (value) => {
            await updateRenderAndPreview({ showWordTextMetricToggle: value });
          });
      });

    new Setting(containerEl)
      .setName(t('settings.tab.render.countLabelMinimum.name'))
      .setDesc(t('settings.tab.render.countLabelMinimum.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(1, 100, 1)
          .setValue(settings.render.countLabelMinCount)
          .setDynamicTooltip()
          .setDisabled(!settings.render.showCountInWordText)
          .onChange(async (value) => {
            await updateRenderAndPreview({ countLabelMinCount: value });
          });
      });

    const deterministicSetting = new Setting(containerEl)
      .setName(t('settings.tab.render.deterministicLayout.name'))
      .setDesc(t('settings.tab.render.deterministicLayout.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.deterministicLayout)
          .onChange(async (value) => {
            await updateRenderAndPreview({ deterministicLayout: value });
            this.display();
          });
      });

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

    new Setting(containerEl)
      .setName(t('settings.tab.render.mouseInteractions.name'))
      .setDesc(t('settings.tab.render.mouseInteractions.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.enableMouseInteractions)
          .onChange(async (value) => {
            await updateRenderAndPreview({ enableMouseInteractions: value });
          });
      });

    new Setting(containerEl)
      .setName(t('settings.tab.render.controls.name'))
      .setDesc(t('settings.tab.render.controls.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.enableControls)
          .onChange(async (value) => {
            await updateRenderAndPreview({ enableControls: value });
          });
      });

    new Setting(containerEl)
      .setName(t('settings.tab.render.exporting.name'))
      .setDesc(t('settings.tab.render.exporting.desc'))
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.enableExporting)
          .onChange(async (value) => {
            await updateRenderAndPreview({ enableExporting: value });
          });
      });

    const advancedRenderDetailsEl = containerEl.createEl('details');
    const advancedRenderSummaryEl = advancedRenderDetailsEl.createEl('summary');
    advancedRenderSummaryEl.setText(t('settings.tab.render.advanced.summary'));

    new Setting(advancedRenderDetailsEl)
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

    new Setting(advancedRenderDetailsEl)
      .setName(t('settings.tab.render.scalingEmphasis.name'))
      .setDesc(t('settings.tab.render.scalingEmphasis.desc'))
      .addSlider((slider) => {
        slider
          .setLimits(0.5, 3, 0.1)
          .setValue(settings.render.emphasis)
          .setDynamicTooltip()
          .setDisabled(settings.render.scalingMode !== 'power')
          .onChange(async (value) => {
            await updateRenderAndPreview({ emphasis: value });
          });
      });

    containerEl.createEl('h3', { text: t('settings.tab.performance.heading') });

    new Setting(containerEl)
      .setName(t('settings.tab.performance.processingSpeed.name'))
      .setDesc(t('settings.tab.performance.processingSpeed.desc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('full-speed', t('settings.tab.performance.processingSpeed.fullSpeed'))
          .addOption('balanced', t('settings.tab.performance.processingSpeed.balanced'))
          .addOption('throttled', t('settings.tab.performance.processingSpeed.throttled'))
          .setValue(settings.render.performanceMode)
          .onChange(async (value) => {
            await this.services.updateRenderSettings({ performanceMode: value as PerformanceMode });
          });
      });

    renderFiltersSection();

    containerEl.createEl('h3', { text: t('settings.tab.reset.heading') });
    containerEl.createEl('p', {
      text: t('settings.tab.reset.description'),
    });

    new Setting(containerEl)
      .setName(t('settings.tab.reset.render.name'))
      .setDesc(t('settings.tab.reset.render.desc'))
      .addButton((button) => {
        button
          .setButtonText(t('settings.tab.reset.render.button'))
          .setWarning()
          .onClick(async () => {
            const confirmed = window.confirm(t('settings.tab.reset.render.confirm'));
            if (!confirmed) {
              return;
            }
            await this.services.resetRenderSettings();
            this.display();
          });
      });

    new Setting(containerEl)
      .setName(t('settings.tab.reset.excludedWords.name'))
      .setDesc(t('settings.tab.reset.excludedWords.desc'))
      .addButton((button) => {
        button
          .setButtonText(t('settings.tab.reset.excludedWords.button'))
          .setWarning()
          .onClick(async () => {
            const confirmed = window.confirm(t('settings.tab.reset.excludedWords.confirm'));
            if (!confirmed) {
              return;
            }
            await this.services.resetExclusionListWords();
            this.display();
          });
      });

    const supportContainerEl = containerEl.createDiv({ cls: 'vault-word-cloud-settings-support' });
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
}
