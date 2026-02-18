import type { Plugin } from 'obsidian';
import { PluginSettingTab, Setting, setIcon } from 'obsidian';
import type {
  PerformanceMode,
  RenderSettings,
  RotationPreset,
  ScalingMode,
  SpiralType,
} from './types';
import type { WordCloudServices } from '../services/types';
import type { WordCloudSettingsControls } from '../services/wordcloud-services';
import { renderWordCloudCanvas } from '../ui/renderers/word-cloud-canvas-renderer';

type SettingsTabServices = WordCloudServices & WordCloudSettingsControls;

const GITHUB_ISSUE_BASE_URL = 'https://github.com/stretchycritter/obsidian-word-clouds/issues/new';
const BUG_REPORT_ISSUE_URL = `${GITHUB_ISSUE_BASE_URL}?template=bug_report.yml`;
const FEATURE_REQUEST_ISSUE_URL = `${GITHUB_ISSUE_BASE_URL}?template=feature_request.yml`;

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

    containerEl.createEl('h2', { text: 'Word clouds settings' });
    const settings = this.services.getSettingsSnapshot();
    containerEl.createEl('h3', { text: 'Filters' });

    let draftWord = '';
    const submitDraftWord = async (): Promise<void> => {
      const added = await this.services.addExclusionListWord(draftWord);
      if (added) {
        this.display();
      }
    };

    new Setting(containerEl)
      .setName('Add excluded word')
      .setDesc('Excluded words are applied vault wide.')
      .addText((text) => {
        text.setPlaceholder('Word to exclude');
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
        button.setButtonText('Add').setCta().onClick(async () => {
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
    excludedWordsSummaryEl.setText(`View excluded words (${sortedWords.length})`);

    const listWrapperEl = excludedWordsDetailsEl.createDiv({ cls: 'vault-word-cloud-settings-list' });
    const listEl = listWrapperEl.createDiv({ cls: 'vault-word-cloud-settings-badges' });

    if (sortedWords.length === 0) {
      listEl.createSpan({ cls: 'vault-word-cloud-settings-badges-empty', text: 'No excluded words configured.' });
    } else {
      for (const word of sortedWords) {
        const badgeEl = listEl.createDiv({ cls: 'vault-word-cloud-settings-badge' });
        badgeEl.createSpan({ cls: 'vault-word-cloud-settings-badge-text', text: word });

        const removeButton = badgeEl.createEl('button', {
          cls: 'vault-word-cloud-settings-badge-remove clickable-icon',
        });
        setIcon(removeButton, 'x');
        removeButton.type = 'button';
        removeButton.setAttr('aria-label', `Remove ${word} from exclusion list`);
        removeButton.setAttr('data-tooltip-position', 'top');
        removeButton.setAttr('data-tooltip', `Remove ${word}`);
        removeButton.addEventListener('click', async () => {
          await this.services.removeExclusionListWord(word);
          this.display();
        });
      }
    }

    containerEl.createEl('h3', { text: 'Render defaults' });
    containerEl.createEl('p').createEl('em', {
      text: 'These settings control what the default rendered view for any Word Cloud is across all pages. These defaults can be overriden for each Word Cloud.',
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
            text: 'Could not render preview.',
          });
        },
        resolveScopeFilePath: () => '',
        resolveExtraContext: () => null,
        getAriaLabel: () => 'Word cloud render preview',
        getNoWordsMessage: () => 'No preview words available.',
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
      .setName('Rotation style')
      .setDesc('How words are angled in the cloud.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('horizontal', 'Horizontal only')
          .addOption('mostly-horizontal', 'Mostly horizontal')
          .addOption('mixed', 'Mixed angles')
          .addOption('vertical', 'Vertical heavy')
          .setValue(settings.render.rotationPreset)
          .onChange(async (value) => {
            await updateRenderAndPreview({
              rotationPreset: value as RotationPreset,
            });
          });
      });

    new Setting(containerEl)
      .setName('Spiral layout')
      .setDesc('Placement strategy for positioning words.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('archimedean', 'Archimedean')
          .addOption('rectangular', 'Rectangular')
          .setValue(settings.render.spiral)
          .onChange(async (value) => {
            await updateRenderAndPreview({
              spiral: value as SpiralType,
            });
          });
      });

    new Setting(containerEl)
      .setName('Word padding')
      .setDesc('Space between words in pixels.')
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
      .setName('Font size range')
      .setDesc('Set minimum and maximum font size. Minimum cannot exceed maximum.')
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
      .setName('Font family')
      .setDesc('Choose a supported font family for words.')
      .addDropdown((dropdown) => {
        for (const font of this.services.getSupportedFontFamilyOptions()) {
          dropdown.addOption(font.value, font.label);
        }
        dropdown
          .setValue(this.services.getSelectedSupportedFontFamily(settings.render.fontFamily))
          .onChange(async (value) => {
            await updateRenderAndPreview({ fontFamily: value });
          });
      });

    new Setting(containerEl)
      .setName('Show count for words')
      .setDesc('Append count directly to rendered words.')
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.showCountInWordText)
          .onChange(async (value) => {
            await updateRenderAndPreview({ showCountInWordText: value });
            this.display();
          });
      });

    new Setting(containerEl)
      .setName('Show count/frequency toggle button')
      .setDesc('Add a rendered-view button to switch inline labels between count and frequency.')
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.showWordTextMetricToggle)
          .setDisabled(!settings.render.showCountInWordText)
          .onChange(async (value) => {
            await updateRenderAndPreview({ showWordTextMetricToggle: value });
          });
      });

    new Setting(containerEl)
      .setName('Count label minimum')
      .setDesc('Show inline count only for words at or above this count.')
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
      .setName('Deterministic layout')
      .setDesc('Keep cloud layout stable across refreshes using a seed.')
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
        text.setPlaceholder('Seed');
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
      .setName('Enable mouse interactions')
      .setDesc('Allow click, context menu, pan, and zoom interactions with the cloud.')
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.enableMouseInteractions)
          .onChange(async (value) => {
            await updateRenderAndPreview({ enableMouseInteractions: value });
          });
      });

    new Setting(containerEl)
      .setName('Enable controls')
      .setDesc('Show on-canvas controls such as refresh and zoom buttons.')
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.enableControls)
          .onChange(async (value) => {
            await updateRenderAndPreview({ enableControls: value });
          });
      });

    new Setting(containerEl)
      .setName('Enable exporting')
      .setDesc('Show export buttons for PNG and SVG downloads.')
      .addToggle((toggle) => {
        toggle
          .setValue(settings.render.enableExporting)
          .onChange(async (value) => {
            await updateRenderAndPreview({ enableExporting: value });
          });
      });

    const advancedRenderDetailsEl = containerEl.createEl('details');
    const advancedRenderSummaryEl = advancedRenderDetailsEl.createEl('summary');
    advancedRenderSummaryEl.setText('Advanced render settings');

    new Setting(advancedRenderDetailsEl)
      .setName('Size scaling mode')
      .setDesc('How numeric count differences map to font-size differences.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('linear', 'Linear')
          .addOption('power', 'Power')
          .addOption('log', 'Log')
          .addOption('rank', 'Rank')
          .setValue(settings.render.scalingMode)
          .onChange(async (value) => {
            await updateRenderAndPreview({ scalingMode: value as ScalingMode });
            this.display();
          });
      });

    new Setting(advancedRenderDetailsEl)
      .setName('Size scaling emphasis')
      .setDesc('Higher values exaggerate size differences (power scaling mode).')
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

    containerEl.createEl('h3', { text: 'Performance' });

    new Setting(containerEl)
      .setName('Processing speed')
      .setDesc('Controls how aggressively scanning your vault and generating word clouds in on render.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('full-speed', 'Full speed')
          .addOption('balanced', 'Balanced (default)')
          .addOption('throttled', 'Throttled')
          .setValue(settings.render.performanceMode)
          .onChange(async (value) => {
            await this.services.updateRenderSettings({ performanceMode: value as PerformanceMode });
          });
      });

    containerEl.createEl('h3', { text: 'Reset settings' });
    containerEl.createEl('p', {
      text: 'Destructive actions. These replace your current settings with defaults.',
    });

    new Setting(containerEl)
      .setName('Reset render defaults')
      .setDesc('Restore all render settings to defaults.')
      .addButton((button) => {
        button
          .setButtonText('Reset render settings')
          .setWarning()
          .onClick(async () => {
            const confirmed = window.confirm('Reset all render settings to defaults? This cannot be undone.');
            if (!confirmed) {
              return;
            }
            await this.services.resetRenderSettings();
            this.display();
          });
      });

    new Setting(containerEl)
      .setName('Reset excluded words')
      .setDesc('Restore the default exclusion list.')
      .addButton((button) => {
        button
          .setButtonText('Reset excluded words')
          .setWarning()
          .onClick(async () => {
            const confirmed = window.confirm('Reset excluded words to the default list? This cannot be undone.');
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
      text: 'Support and feedback',
    });
    supportContainerEl.createEl('p', {
      cls: 'vault-word-cloud-settings-support-copy',
      text: 'Open a GitHub issue to report a bug or suggest a feature.',
    });

    const supportButtonsEl = supportContainerEl.createDiv({ cls: 'vault-word-cloud-settings-support-actions' });

    const featureButtonEl = supportButtonsEl.createEl('button', {
      cls: 'mod-cta vault-word-cloud-settings-support-button vault-word-cloud-settings-support-button-feature',
      text: 'Suggest a feature',
    });
    featureButtonEl.type = 'button';
    featureButtonEl.setAttr('aria-label', 'Suggest a feature');
    featureButtonEl.addEventListener('click', () => {
      window.open(FEATURE_REQUEST_ISSUE_URL, '_blank', 'noopener,noreferrer');
    });

    const bugButtonEl = supportButtonsEl.createEl('button', {
      cls: 'vault-word-cloud-settings-support-button vault-word-cloud-settings-support-button-report',
      text: 'Report a bug',
    });
    bugButtonEl.type = 'button';
    bugButtonEl.setAttr('aria-label', 'Report a bug');
    bugButtonEl.addEventListener('click', () => {
      window.open(BUG_REPORT_ISSUE_URL, '_blank', 'noopener,noreferrer');
    });

    void rerenderPreview();
  }
}
