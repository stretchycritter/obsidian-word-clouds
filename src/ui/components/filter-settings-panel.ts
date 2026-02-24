import { Setting, ToggleComponent, setIcon } from 'obsidian';
import type { NlpSettings } from '@/settings/types';
import { t } from '@/i18n';

export type FilterSettingsPanelState = {
  minWordLength: number;
  nlp: NlpSettings;
};

export type FilterSettingsPanelCallbacks = {
  onMinWordLengthChange: (value: number) => void;
  onNlpSettingsChange: (nlp: NlpSettings) => void;
};

export function renderFilterSettingsPanel(
  containerEl: HTMLElement,
  state: FilterSettingsPanelState,
  callbacks: FilterSettingsPanelCallbacks,
): void {
  new Setting(containerEl)
    .setName(t('settings.tab.filters.minimumWordLength.name'))
    .setDesc(t('settings.tab.filters.minimumWordLength.desc'))
    .addSlider((slider) => {
      slider
        .setLimits(1, 32, 1)
        .setValue(state.minWordLength)
        .setDynamicTooltip()
        .onChange((value) => {
          callbacks.onMinWordLengthChange(value);
        });
    });

  let currentNlp = { ...state.nlp };
  let nlpSubSettingsOuterEl!: HTMLElement;
  let nlpChevronEl!: HTMLSpanElement;
  let nlpToggleComponent!: ToggleComponent;

  const nlpEnabledNameFrag = document.createDocumentFragment();
  nlpChevronEl = nlpEnabledNameFrag.appendChild(document.createElement('span'));
  nlpChevronEl.className = 'vault-word-cloud-settings-nlp-chevron';
  setIcon(nlpChevronEl, 'chevron-right');
  if (currentNlp.enabled) {
    nlpChevronEl.classList.add('is-open');
  }
  nlpEnabledNameFrag.append(t('settings.tab.filters.nlp.enabled.name'));
  const nlpChipEl = nlpEnabledNameFrag.appendChild(document.createElement('span'));
  nlpChipEl.className = 'vault-word-cloud-settings-nlp-chip';
  nlpChipEl.textContent = 'NLP';

  const applyNlpEnabled = (value: boolean): void => {
    const nextMode = value && currentNlp.mode === 'off' ? 'light' : currentNlp.mode;
    currentNlp = { ...currentNlp, enabled: value, mode: nextMode };
    nlpSubSettingsOuterEl.toggleClass('is-open', value);
    nlpChevronEl.toggleClass('is-open', value);
    if (value) {
      requestAnimationFrame(() => {
        nlpSubSettingsOuterEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
    callbacks.onNlpSettingsChange(currentNlp);
  };

  const nlpSetting = new Setting(containerEl)
    .setName(nlpEnabledNameFrag)
    .setDesc(t('settings.tab.filters.nlp.enabled.desc'))
    .setClass('vault-word-cloud-settings-nlp-parent')
    .addToggle((toggle) => {
      nlpToggleComponent = toggle;
      toggle
        .setValue(currentNlp.enabled)
        .onChange((value) => {
          applyNlpEnabled(value);
        });
    });

  nlpSetting.nameEl.addClass('wc-cursor-pointer');
  nlpSetting.nameEl.addEventListener('click', () => {
    const newValue = !currentNlp.enabled;
    nlpToggleComponent.setValue(newValue);
    applyNlpEnabled(newValue);
  });

  nlpSubSettingsOuterEl = containerEl.createDiv({
    cls: `vault-word-cloud-settings-nlp-subsettings${currentNlp.enabled ? ' is-open' : ''}`,
  });
  const nlpSubSettingsEl = nlpSubSettingsOuterEl.createDiv({
    cls: 'vault-word-cloud-settings-nlp-subsettings-inner',
  });

  new Setting(nlpSubSettingsEl)
    .setName(t('settings.tab.filters.nlp.mode.name'))
    .setDesc(t('settings.tab.filters.nlp.mode.desc'))
    .addDropdown((dropdown) => {
      dropdown
        .addOption('off', t('settings.tab.filters.nlp.mode.off'))
        .addOption('light', t('settings.tab.filters.nlp.mode.light'))
        .addOption('aggressive', t('settings.tab.filters.nlp.mode.aggressive'))
        .setValue(currentNlp.mode)
        .onChange((value) => {
          currentNlp = {
            ...currentNlp,
            mode: value === 'light' || value === 'aggressive' ? value : 'off',
          };
          callbacks.onNlpSettingsChange(currentNlp);
        });
    });

  new Setting(nlpSubSettingsEl)
    .setName(t('settings.tab.filters.nlp.preserveAcronyms.name'))
    .setDesc(t('settings.tab.filters.nlp.preserveAcronyms.desc'))
    .addToggle((toggle) => {
      toggle
        .setValue(currentNlp.preserveAcronyms)
        .onChange((value) => {
          currentNlp = { ...currentNlp, preserveAcronyms: value };
          callbacks.onNlpSettingsChange(currentNlp);
        });
    });

  new Setting(nlpSubSettingsEl)
    .setName(t('settings.tab.filters.nlp.minLemmaLength.name'))
    .setDesc(t('settings.tab.filters.nlp.minLemmaLength.desc'))
    .addSlider((slider) => {
      slider
        .setLimits(2, 32, 1)
        .setValue(currentNlp.minLemmaLength)
        .setDynamicTooltip()
        .onChange((value) => {
          currentNlp = { ...currentNlp, minLemmaLength: value };
          callbacks.onNlpSettingsChange(currentNlp);
        });
    });

  new Setting(nlpSubSettingsEl)
    .setName(t('settings.tab.filters.nlp.filterNumericTokens.name'))
    .setDesc(t('settings.tab.filters.nlp.filterNumericTokens.desc'))
    .addToggle((toggle) => {
      toggle
        .setValue(currentNlp.filterNumericTokens)
        .onChange((value) => {
          currentNlp = { ...currentNlp, filterNumericTokens: value };
          callbacks.onNlpSettingsChange(currentNlp);
        });
    });
}
