import { App, Modal, Setting } from 'obsidian';
import type { PerformanceMode, RenderSettings, WordCloudSettings } from '@/settings/types';
import type { VaultCollectionOptions, WordCloudServices } from '@/services/types';
import type { WordCloudSettingsControls } from '@/services/wordcloud-services';
import { t, type TranslationKey } from '@/i18n';

export type PerformanceModeRunResult = {
  mode: PerformanceMode;
  message: string;
};

type BenchmarkCollectionOptions = Omit<VaultCollectionOptions, 'renderSettingsOverride' | 'excludeWords'>;
type BenchmarkServices = WordCloudServices & WordCloudSettingsControls;

export const BENCHMARK_MODES: PerformanceMode[] = ['full-speed', 'balanced', 'throttled'];

const GITHUB_ISSUE_BASE_URL = 'https://github.com/stretchycritter/obsidian-word-clouds/issues/new';
const BUG_REPORT_ISSUE_URL = `${GITHUB_ISSUE_BASE_URL}?template=bug_report.yml`;
const FEATURE_REQUEST_ISSUE_URL = `${GITHUB_ISSUE_BASE_URL}?template=feature_request.yml`;

export function formatT(key: TranslationKey, replacements: Record<string, string | number>): string {
  let value = t(key);
  for (const [token, replacement] of Object.entries(replacements)) {
    value = value.replace(`{${token}}`, String(replacement));
  }
  return value;
}

export function getFontLabel(value: string, fallback: string): string {
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
  return translationKey ? t(translationKey as TranslationKey) : fallback;
}

export class ConfirmResetModal extends Modal {
  private onConfirm: () => void;

  constructor(app: App, onConfirm: () => void) {
    super(app);
    this.onConfirm = onConfirm;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.createEl('p', { text: t('settings.tab.reset.all.confirm') });
    const buttonRow = contentEl.createDiv({ cls: 'modal-button-container' });
    buttonRow.createEl('button', { text: 'Cancel' }).addEventListener('click', () => {
      this.close();
    });
    const confirmBtn = buttonRow.createEl('button', {
      text: t('settings.tab.reset.all.button'),
      cls: 'mod-warning',
    });
    confirmBtn.addEventListener('click', () => {
      this.onConfirm();
      this.close();
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

export function renderResetSection(
  contentEl: HTMLElement,
  app: App,
  services: Pick<WordCloudSettingsControls, 'resetAllSettings'>,
  onDisplay: () => void,
): void {
  const sectionEl = contentEl.createDiv({
    cls: 'vault-word-cloud-settings-section vault-word-cloud-settings-reset-wrapper',
  });
  new Setting(sectionEl).setName(t('settings.tab.reset.heading')).setHeading();

  new Setting(sectionEl)
    .setDesc(t('settings.tab.reset.all.desc'))
    .addButton((button) => {
      button
        .setButtonText(t('settings.tab.reset.all.button'))
        .setWarning()
        .onClick(() => {
          new ConfirmResetModal(app, async () => {
            await services.resetAllSettings();
            onDisplay();
          }).open();
        });
    });
}

export function renderSupportSection(contentEl: HTMLElement): void {
  const supportContainerEl = contentEl.createDiv({
    cls: 'vault-word-cloud-settings-section vault-word-cloud-settings-support',
  });
  new Setting(supportContainerEl).setName(t('settings.tab.support.title')).setHeading();
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
}

export function performanceModeLabelKey(mode: PerformanceMode): 'fullSpeed' | 'balanced' | 'throttled' {
  if (mode === 'full-speed') {
    return 'fullSpeed';
  }
  if (mode === 'throttled') {
    return 'throttled';
  }
  return 'balanced';
}

export function renderPerformanceSection(
  contentEl: HTMLElement,
  settings: Readonly<WordCloudSettings>,
  isBenchmarkRunInProgress: boolean,
  benchmarkResults: PerformanceModeRunResult[],
  updateRenderAndPreview: (patch: Partial<RenderSettings>) => Promise<void>,
  onRunBenchmarks: () => Promise<void>,
): void {
  const sectionEl = contentEl.createDiv({ cls: 'vault-word-cloud-settings-section' });
  new Setting(sectionEl).setName(t('settings.tab.performance.heading')).setHeading();

  new Setting(sectionEl)
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

  const benchmarkContainerEl = sectionEl.createDiv({ cls: 'vault-word-cloud-settings-benchmark-container' });
  const benchmarkBlockEl = benchmarkContainerEl.createDiv({ cls: 'vault-word-cloud-settings-benchmark-block' });

  new Setting(benchmarkBlockEl)
    .setName(t('settings.tab.performance.benchmark.name'))
    .setDesc(t('settings.tab.performance.benchmark.desc'))
    .addButton((button) => {
      button
        .setButtonText(
          isBenchmarkRunInProgress
            ? t('settings.tab.performance.benchmark.buttonRunning')
            : t('settings.tab.performance.benchmark.button'),
        )
        .setCta()
        .onClick(async () => {
          await onRunBenchmarks();
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

  if (benchmarkResults.length === 0) {
    const rowEl = benchmarkBodyEl.createEl('tr');
    const cellEl = rowEl.createEl('td', { text: t('settings.tab.performance.benchmark.results.empty') });
    cellEl.setAttr('colspan', '2');
  } else {
    for (const result of benchmarkResults) {
      const rowEl = benchmarkBodyEl.createEl('tr');
      rowEl.createEl('td', {
        text: t(`settings.tab.performance.processingSpeed.${performanceModeLabelKey(result.mode)}` as TranslationKey),
      });
      rowEl.createEl('td', { text: result.message });
    }
  }
}

export async function executeBenchmarkRun(services: BenchmarkServices): Promise<PerformanceModeRunResult[]> {
  const settings = services.getSettingsSnapshot();
  const benchmarkOptions: BenchmarkCollectionOptions = {
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

  await runBenchmarkWarmup(services, settings.render.performanceMode, benchmarkOptions);

  const results: PerformanceModeRunResult[] = [];
  for (const mode of BENCHMARK_MODES) {
    results.push(await runBenchmarkMode(services, mode, benchmarkOptions));
  }
  return results;
}

async function runBenchmarkWarmup(
  services: BenchmarkServices,
  mode: PerformanceMode,
  options: BenchmarkCollectionOptions,
): Promise<void> {
  try {
    await services.collectVaultWordsWithMetrics({
      ...options,
      renderSettingsOverride: { performanceMode: mode },
    });
  } catch {
    // Ignore warm-up errors and continue to measured benchmark runs.
  }
}

async function runBenchmarkMode(
  services: BenchmarkServices,
  mode: PerformanceMode,
  options: BenchmarkCollectionOptions,
): Promise<PerformanceModeRunResult> {
  const startedAt = Date.now();
  try {
    const result = await services.collectVaultWordsWithMetrics({
      ...options,
      renderSettingsOverride: { performanceMode: mode },
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
        message: formatErrorMessage(error),
      }),
    };
  }
}

function formatErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return t('settings.tab.performance.benchmark.results.unknownError');
}
