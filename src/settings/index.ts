import { PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_STOP_WORDS } from '../constants';
import type {
  CountLabelFormat,
  ProgressDetail,
  RenderSettings,
  RotationPreset,
  ScalingMode,
  SpiralType,
  WordCloudFilterSettings,
  WeightedWord,
} from '../types';
import type VaultWordCloudPlugin from '../main';
import { mapCountsToWeightedWords } from '../processing/scaling';

export interface WordCloudSettings {
  blacklistWords: string[];
  render: RenderSettings;
  filters: WordCloudFilterSettings;
}

export const DEFAULT_SETTINGS: WordCloudSettings = {
  blacklistWords: [...DEFAULT_STOP_WORDS],
  render: {
    rotationPreset: 'mostly-horizontal',
    spiral: 'archimedean',
    wordPadding: 2,
    minFontSize: 14,
    maxFontSize: 72,
    fontFamily: 'sans-serif',
    scalingMode: 'power',
    emphasis: 1,
    showCountInWordText: false,
    countLabelFormat: 'paren',
    countLabelMinCount: 1,
    progressDetail: 'balanced',
    scanBatchSize: 24,
    layoutTimeIntervalMs: 16,
    deterministicLayout: false,
    randomSeed: 42,
  },
  filters: {
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
  },
};

export class VaultWordCloudSettingTab extends PluginSettingTab {
  private readonly plugin: VaultWordCloudPlugin;

  constructor(plugin: VaultWordCloudPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Word clouds settings' });

    let draftWord = '';

    const addExcludedWord = new Setting(containerEl)
      .setName('Add excluded word')
      .setDesc('Add one word at a time to the blacklist.')
      .addText((text) => {
        text.setPlaceholder('Word to exclude');
        text.onChange((value) => {
          draftWord = value;
        });
      })
      .addButton((button) => {
        button
          .setButtonText('Add')
          .setCta()
          .onClick(async () => {
            const added = await this.plugin.addBlacklistWord(draftWord);
            if (added) {
              this.display();
            }
          });
      });
    this.attachInfoIcon(addExcludedWord, 'Excluded words are always ignored from counting and sizing in all cloud types.');

    const listWrapperEl = containerEl.createDiv({ cls: 'vault-word-cloud-settings-list' });
    listWrapperEl.createEl('h3', { text: 'Excluded words' });
    const listEl = listWrapperEl.createDiv({ cls: 'vault-word-cloud-settings-badges' });
    const sortedWords = [...this.plugin.settings.blacklistWords].sort((a, b) => a.localeCompare(b));

    if (sortedWords.length === 0) {
      listEl.createSpan({ cls: 'vault-word-cloud-settings-badges-empty', text: 'No excluded words configured.' });
    } else {
      for (const word of sortedWords) {
        const badgeEl = listEl.createDiv({ cls: 'vault-word-cloud-settings-badge' });
        badgeEl.createSpan({ cls: 'vault-word-cloud-settings-badge-text', text: word });

        const removeButton = badgeEl.createEl('button', {
          cls: 'vault-word-cloud-settings-badge-remove',
          text: 'x',
        });
        removeButton.setAttr('aria-label', `Remove ${word}`);
        removeButton.addEventListener('click', async () => {
          await this.plugin.removeBlacklistWord(word);
          this.display();
        });
      }
    }

    const resetExcludedWords = new Setting(containerEl)
      .setName('Reset excluded words')
      .setDesc('Restore the original default blacklist.')
      .addButton((button) => {
        button
          .setButtonText('Reset to defaults')
          .onClick(async () => {
            await this.plugin.resetBlacklistWords();
            this.display();
          });
      });
    this.attachInfoIcon(resetExcludedWords, 'Resets only excluded words. Rendering and performance settings are unchanged.');

    containerEl.createEl('h3', { text: 'Rendering' });

    const previewWrapperEl = containerEl.createDiv({ cls: 'vault-word-cloud-settings-preview' });
    previewWrapperEl.createEl('h4', { text: 'Preview' });
    previewWrapperEl.createEl('p', {
      text: 'Example cloud for render settings (does not use your vault data).',
    });
    const previewCanvasEl = previewWrapperEl.createDiv({ cls: 'vault-word-cloud-settings-preview-canvas' });

    let previewNonce = 0;
    const rerenderPreview = async (): Promise<void> => {
      const nonce = ++previewNonce;
      previewCanvasEl.empty();
      const loadingEl = previewCanvasEl.createDiv({ cls: 'vault-word-cloud-state', text: 'Rendering preview...' });

      try {
        const sampleWords = this.buildPreviewWords(this.plugin.settings.render);
        loadingEl.remove();
        await this.plugin.drawWordCloud({
          containerEl: previewCanvasEl,
          words: sampleWords,
          ariaLabel: 'Word cloud render preview',
          onRefresh: rerenderPreview,
          onWordClick: () => {
            // no-op in settings preview
          },
          enableExport: false,
        });
      } catch {
        if (nonce !== previewNonce) {
          return;
        }

        loadingEl.remove();
        previewCanvasEl.createDiv({
          cls: 'vault-word-cloud-state',
          text: 'Could not render preview.',
        });
      }
    };

    const updateRenderAndPreview = async (patch: Partial<RenderSettings>): Promise<void> => {
      await this.plugin.updateRenderSettings(patch);
      await rerenderPreview();
    };

    const rotationStyle = new Setting(containerEl)
      .setName('Rotation style')
      .setDesc('How words are angled in the cloud.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('horizontal', 'Horizontal only')
          .addOption('mostly-horizontal', 'Mostly horizontal')
          .addOption('mixed', 'Mixed angles')
          .addOption('vertical', 'Vertical heavy')
          .setValue(this.plugin.settings.render.rotationPreset)
          .onChange(async (value) => {
            await updateRenderAndPreview({
              rotationPreset: value as RotationPreset,
            });
          });
      });
    this.attachInfoIcon(rotationStyle, 'Horizontal is easiest to read. Mixed/vertical can pack more words but may reduce readability.');

    const spiralLayout = new Setting(containerEl)
      .setName('Spiral layout')
      .setDesc('Placement strategy for positioning words.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('archimedean', 'Archimedean')
          .addOption('rectangular', 'Rectangular')
          .setValue(this.plugin.settings.render.spiral)
          .onChange(async (value) => {
            await updateRenderAndPreview({
              spiral: value as SpiralType,
            });
          });
      });
    this.attachInfoIcon(spiralLayout, 'Archimedean is more organic. Rectangular can appear tighter in some datasets.');

    const wordPadding = new Setting(containerEl)
      .setName('Word padding')
      .setDesc('Space between words in pixels.')
      .addSlider((slider) => {
        slider
          .setLimits(0, 12, 1)
          .setValue(this.plugin.settings.render.wordPadding)
          .setDynamicTooltip()
          .onChange(async (value) => {
            await updateRenderAndPreview({ wordPadding: value });
          });
      });
    this.attachInfoIcon(wordPadding, 'Increase to reduce collisions and improve readability. Lower values pack more words.');

    const minFontSize = new Setting(containerEl)
      .setName('Minimum font size')
      .setDesc('Smallest rendered word size.')
      .addSlider((slider) => {
        slider
          .setLimits(8, 64, 1)
          .setValue(this.plugin.settings.render.minFontSize)
          .setDynamicTooltip()
          .onChange(async (value) => {
            await updateRenderAndPreview({ minFontSize: value });
          });
      });
    this.attachInfoIcon(minFontSize, 'Sets the floor of visual size mapping. Higher minimum makes low-frequency words more legible.');

    const maxFontSize = new Setting(containerEl)
      .setName('Maximum font size')
      .setDesc('Largest rendered word size.')
      .addSlider((slider) => {
        slider
          .setLimits(16, 140, 1)
          .setValue(this.plugin.settings.render.maxFontSize)
          .setDynamicTooltip()
          .onChange(async (value) => {
            await updateRenderAndPreview({ maxFontSize: value });
          });
      });
    this.attachInfoIcon(maxFontSize, 'Sets the ceiling of visual size mapping. Higher values emphasize top words more strongly.');

    const fontFamily = new Setting(containerEl)
      .setName('Font family')
      .setDesc('CSS font family used for words.')
      .addText((text) => {
        text
          .setPlaceholder('sans-serif')
          .setValue(this.plugin.settings.render.fontFamily)
          .onChange(async (value) => {
            await updateRenderAndPreview({ fontFamily: value.trim() || 'sans-serif' });
          });
      });
    this.attachInfoIcon(fontFamily, 'Wider fonts take more space and can increase overlap pressure.');

    const showCountInWordText = new Setting(containerEl)
      .setName('Show count in word text')
      .setDesc('Append the occurrence count directly to rendered words.')
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.render.showCountInWordText)
          .onChange(async (value) => {
            await updateRenderAndPreview({ showCountInWordText: value });
            this.display();
          });
      });
    this.attachInfoIcon(showCountInWordText, 'Shows exact counts inline (e.g., word (12)). Improves precision, increases text length.');

    const countLabelFormat = new Setting(containerEl)
      .setName('Count label format')
      .setDesc('How counts are shown when count labels are enabled.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('paren', 'word (12)')
          .addOption('dot', 'word · 12')
          .addOption('colon', 'word: 12')
          .setValue(this.plugin.settings.render.countLabelFormat)
          .setDisabled(!this.plugin.settings.render.showCountInWordText)
          .onChange(async (value) => {
            await updateRenderAndPreview({ countLabelFormat: value as CountLabelFormat });
          });
      });
    this.attachInfoIcon(countLabelFormat, 'Formatting style for inline counts.');

    const countLabelMinimum = new Setting(containerEl)
      .setName('Count label minimum')
      .setDesc('Show inline count only for words at or above this count.')
      .addSlider((slider) => {
        slider
          .setLimits(1, 100, 1)
          .setValue(this.plugin.settings.render.countLabelMinCount)
          .setDynamicTooltip()
          .setDisabled(!this.plugin.settings.render.showCountInWordText)
          .onChange(async (value) => {
            await updateRenderAndPreview({ countLabelMinCount: value });
          });
      });
    this.attachInfoIcon(countLabelMinimum, 'Avoids visual noise by hiding counts for very small values.');

    const sizeScalingMode = new Setting(containerEl)
      .setName('Size scaling mode')
      .setDesc('How numeric count differences map to font-size differences.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('linear', 'Linear')
          .addOption('power', 'Power')
          .addOption('log', 'Log')
          .addOption('rank', 'Rank')
          .setValue(this.plugin.settings.render.scalingMode)
          .onChange(async (value) => {
            await updateRenderAndPreview({ scalingMode: value as ScalingMode });
            this.display();
          });
      });
    this.attachInfoIcon(sizeScalingMode, 'Linear is proportional. Power exaggerates gaps. Log compresses extremes. Rank ignores absolute gaps.');

    const emphasis = new Setting(containerEl)
      .setName('Emphasis')
      .setDesc('Higher values exaggerate size differences (power scaling mode).')
      .addSlider((slider) => {
        slider
          .setLimits(0.5, 3, 0.1)
          .setValue(this.plugin.settings.render.emphasis)
          .setDynamicTooltip()
          .setDisabled(this.plugin.settings.render.scalingMode !== 'power')
          .onChange(async (value) => {
            await updateRenderAndPreview({ emphasis: value });
          });
      });
    this.attachInfoIcon(emphasis, 'Only used in Power scaling mode. 1.0 is baseline; higher exaggerates differences more.');

    const deterministicLayout = new Setting(containerEl)
      .setName('Deterministic layout')
      .setDesc('Keep cloud layout stable across refreshes using a seed.')
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.render.deterministicLayout)
          .onChange(async (value) => {
            await updateRenderAndPreview({ deterministicLayout: value });
            this.display();
          });
      });
    this.attachInfoIcon(deterministicLayout, 'Useful for comparing before/after changes with stable positions.');

    const randomSeed = new Setting(containerEl)
      .setName('Random seed')
      .setDesc('Seed used when deterministic layout is enabled.')
      .addText((text) => {
        text
          .setValue(String(this.plugin.settings.render.randomSeed))
          .setDisabled(!this.plugin.settings.render.deterministicLayout)
          .onChange(async (value) => {
            const parsed = Number.parseInt(value, 10);
            if (!Number.isNaN(parsed)) {
              await updateRenderAndPreview({ randomSeed: parsed });
            }
          });
      });
    this.attachInfoIcon(randomSeed, 'Changing seed gives a different stable arrangement.');

    const resetRendering = new Setting(containerEl)
      .setName('Reset rendering settings')
      .setDesc('Restore default renderer controls.')
      .addButton((button) => {
        button
          .setButtonText('Reset rendering')
          .onClick(async () => {
            await this.plugin.resetRenderSettings();
            this.display();
          });
      });
    this.attachInfoIcon(resetRendering, 'Resets rendering options only.');

    containerEl.createEl('h3', { text: 'Performance' });
    containerEl.createEl('p', {
      text: 'Tune speed vs UI smoothness and progress update detail for large clouds.',
    });

    const progressDetail = new Setting(containerEl)
      .setName('Progress detail')
      .setDesc('How frequently progress is updated while scanning and layout.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('unhinged', 'Unhinged (max speed)')
          .addOption('minimal', 'Minimal (fastest)')
          .addOption('balanced', 'Balanced')
          .addOption('detailed', 'Detailed')
          .setValue(this.plugin.settings.render.progressDetail)
          .onChange(async (value) => {
            await this.plugin.updateRenderSettings({ progressDetail: value as ProgressDetail });
          });
      });
    this.attachInfoIcon(progressDetail, 'Unhinged maximizes speed and may lock UI temporarily. Detailed is most informative but slower.');

    const scanBatchSize = new Setting(containerEl)
      .setName('Scan batch size')
      .setDesc('How many files are read in parallel during vault scanning.')
      .addSlider((slider) => {
        slider
          .setLimits(8, 64, 1)
          .setValue(this.plugin.settings.render.scanBatchSize)
          .setDynamicTooltip()
          .onChange(async (value) => {
            await this.plugin.updateRenderSettings({ scanBatchSize: value });
          });
      });
    this.attachInfoIcon(scanBatchSize, 'Higher can be faster on strong devices but uses more memory/IO.');

    const layoutTimeSlice = new Setting(containerEl)
      .setName('Layout time slice (ms)')
      .setDesc('Time per layout chunk. Lower is smoother; higher is faster.')
      .addSlider((slider) => {
        slider
          .setLimits(8, 40, 1)
          .setValue(this.plugin.settings.render.layoutTimeIntervalMs)
          .setDynamicTooltip()
          .onChange(async (value) => {
            await this.plugin.updateRenderSettings({ layoutTimeIntervalMs: value });
          });
      });
    this.attachInfoIcon(layoutTimeSlice, 'Controls responsiveness while laying out words.');

    const resetPerformance = new Setting(containerEl)
      .setName('Reset performance settings')
      .setDesc('Restore default performance tuning values.')
      .addButton((button) => {
        button
          .setButtonText('Reset performance')
          .onClick(async () => {
            await this.plugin.updateRenderSettings({
              progressDetail: DEFAULT_SETTINGS.render.progressDetail,
              scanBatchSize: DEFAULT_SETTINGS.render.scanBatchSize,
              layoutTimeIntervalMs: DEFAULT_SETTINGS.render.layoutTimeIntervalMs,
            });
            this.display();
          });
      });
    this.attachInfoIcon(resetPerformance, 'Resets performance tuning only.');

    void rerenderPreview();
  }

  private attachInfoIcon(setting: Setting, infoText: string): void {
    const icon = setting.nameEl.createEl('button', {
      cls: 'word-cloud-setting-info',
      text: 'i',
    });
    icon.type = 'button';
    icon.setAttr('aria-label', 'Show setting details');
    icon.setAttr('data-tooltip-position', 'top');
    icon.setAttr('data-tooltip', infoText);

    const popover = setting.settingEl.createDiv({ cls: 'word-cloud-setting-info-popover' });
    popover.setText(infoText);
    popover.setAttr('hidden', 'true');

    icon.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (popover.hasAttribute('hidden')) {
        popover.removeAttribute('hidden');
      } else {
        popover.setAttr('hidden', 'true');
      }
    });

    icon.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        popover.setAttr('hidden', 'true');
      }
    });
  }

  private buildPreviewWords(renderSettings: RenderSettings): WeightedWord[] {
    const template = [
      { text: 'obsidian', count: 48 },
      { text: 'notes', count: 43 },
      { text: 'plugins', count: 36 },
      { text: 'vault', count: 33 },
      { text: 'research', count: 28 },
      { text: 'ideas', count: 25 },
      { text: 'writing', count: 22 },
      { text: 'daily', count: 20 },
      { text: 'project', count: 18 },
      { text: 'review', count: 16 },
      { text: 'design', count: 14 },
      { text: 'meeting', count: 12 },
      { text: 'tasks', count: 11 },
      { text: 'journal', count: 10 },
      { text: 'draft', count: 9 },
      { text: 'reading', count: 8 },
      { text: 'plan', count: 7 },
      { text: 'focus', count: 6 },
      { text: 'habit', count: 5 },
      { text: 'goals', count: 4 },
    ];

    return mapCountsToWeightedWords(template.map((entry) => [entry.text, entry.count] as [string, number]), renderSettings);
  }
}
