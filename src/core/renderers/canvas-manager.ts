import { Notice } from 'obsidian';
import type { SearchOptions, WordCloudRenderOptions, WordCloudServices } from '@/services/types';
import type { RenderSettings, WordCloudFilterSettings } from '@/settings/types';
import type { WeightedWord } from '@/core/types';
import { t } from '@/i18n';

type RenderNonceRef = {
  value: number;
};

type RenderContext<TExtra> = {
  filters?: WordCloudFilterSettings;
  scopeFilePath: string;
  extra: TExtra;
};

type WordCloudStatusHandle = {
  setText: (text: string) => void;
  remove: () => void;
};

type RenderWordCloudCanvasOptions<TExtra> = {
  nonceRef: RenderNonceRef;
  containerEl: HTMLDivElement;
  services: WordCloudServices;
  filters?: WordCloudFilterSettings;
  errorLogPrefix: string;
  createStatusHandle: (initialText: string) => WordCloudStatusHandle;
  renderEmptyState: (message: string) => void;
  renderErrorState: (message: string) => void;
  resolveScopeFilePath: () => string;
  resolveExtraContext: (scopeFilePath: string) => TExtra;
  getAriaLabel: (context: RenderContext<TExtra>) => string;
  getNoWordsMessage: (context: RenderContext<TExtra>) => string;
  getSearchOptions?: (context: RenderContext<TExtra>) => SearchOptions;
  onWordClick?: (word: string, context: RenderContext<TExtra>) => void;
  getRenderSettingsOverride?: (context: RenderContext<TExtra>) => Partial<RenderSettings> | undefined;
  getWords?: (
    context: RenderContext<TExtra>,
    updateProgress: (message: string, percent: number) => void,
    renderSettingsOverride: Partial<RenderSettings> | undefined,
  ) => Promise<WeightedWord[]>;
  getDrawOptions?: (context: RenderContext<TExtra>) => Partial<WordCloudRenderOptions>;
  onWordsResolved?: (words: WeightedWord[], context: RenderContext<TExtra>) => void;
  onAfterRender?: (context: RenderContext<TExtra>) => void;
  onAfterEmpty?: (context: RenderContext<TExtra>) => void;
  onRefresh: () => Promise<void>;
};

function collectWords(
  services: WordCloudServices,
  filters: WordCloudFilterSettings,
  scopeFilePath: string,
  renderSettingsOverride: Partial<RenderSettings> | undefined,
  onProgress: (message: string, percent: number) => void,
): Promise<WeightedWord[]> {
  if (!filters) {
    return Promise.resolve([]);
  }
  return services.collectVaultWords({
    sourceRules: {
      scope: {
        ...filters.scope,
        activeFilePath: scopeFilePath,
      },
      includeTags: filters.includeTags,
      excludeTags: filters.excludeTags,
      tagMatchMode: filters.tagMatchMode,
      frontmatterRules: filters.frontmatterRules,
    },
    frequency: filters.frequency,
    renderSettingsOverride,
  }, onProgress);
}

export async function renderWordCloudCanvas<TExtra>(
  options: RenderWordCloudCanvasOptions<TExtra>,
): Promise<void> {
  const {
    nonceRef,
    containerEl,
    services,
    filters,
    errorLogPrefix,
    createStatusHandle,
    renderEmptyState,
    renderErrorState,
    resolveScopeFilePath,
    resolveExtraContext,
    getAriaLabel,
    getNoWordsMessage,
    getSearchOptions,
    onWordClick,
    getRenderSettingsOverride,
    getWords,
    getDrawOptions,
    onWordsResolved,
    onAfterRender,
    onAfterEmpty,
    onRefresh,
  } = options;

  const activeNonce = ++nonceRef.value;
  containerEl.empty();
  const statusHandle = createStatusHandle(t('ui.renderers.wordCloudCanvas.buildingCloud'));
  const updateProgress = (message: string, percent: number): void => {
    if (activeNonce !== nonceRef.value) {
      return;
    }
    statusHandle.setText(`${message} (${percent}%)`);
  };

  try {
    const scopeFilePath = resolveScopeFilePath();
    const extra = resolveExtraContext(scopeFilePath);
    const context: RenderContext<TExtra> = {
      filters,
      scopeFilePath,
      extra,
    };
    const renderSettingsOverride = getRenderSettingsOverride?.(context);
    const words = getWords
      ? await getWords(context, updateProgress, renderSettingsOverride)
      : await collectWords(
        services,
        filters ?? (() => {
          throw new Error('Word cloud filters are required when getWords is not provided.');
        })(),
        scopeFilePath,
        renderSettingsOverride,
        updateProgress,
      );

    onWordsResolved?.(words, context);

    if (words.length === 0) {
      statusHandle.remove();
      renderEmptyState(getNoWordsMessage(context));
      onAfterEmpty?.(context);
      return;
    }

    const drawOptions = getDrawOptions?.(context);
    const resolvedWordClick = onWordClick
      ? (word: string) => onWordClick(word, context)
      : (word: string) => {
        if (!getSearchOptions) {
          return;
        }
        void services.openSearchForWord(word, getSearchOptions(context));
      };

    await services.drawWordCloud({
      containerEl,
      words,
      ariaLabel: getAriaLabel(context),
      onProgress: updateProgress,
      onRefresh,
      onExcludeInVault: drawOptions?.onExcludeInVault ?? (async (word) => {
        const added = await services.addExclusionListWord(word);
        new Notice(
          added
            ? t('notices.excludedFromWordClouds').replace('{word}', word)
            : t('notices.wordAlreadyExcluded').replace('{word}', word),
        );
        await onRefresh();
      }),
      onExcludeInCloud: drawOptions?.onExcludeInCloud,
      onEdit: drawOptions?.onEdit,
      enableExport: drawOptions?.enableExport,
      enableOverlayControls: drawOptions?.enableOverlayControls,
      enableViewportInteraction: drawOptions?.enableViewportInteraction,
      showRefreshControl: drawOptions?.showRefreshControl,
      showZoomControls: drawOptions?.showZoomControls,
      showEditControl: drawOptions?.showEditControl,
      exportBaseName: drawOptions?.exportBaseName,
      onWordClick: resolvedWordClick,
      renderSettingsOverride,
    });

    if (activeNonce !== nonceRef.value) {
      return;
    }

    statusHandle.remove();
    onAfterRender?.(context);
  } catch (error) {
    statusHandle.remove();
    console.error(`${errorLogPrefix}: failed to render cloud`, error);
    renderErrorState(t('ui.renderers.wordCloudCanvas.renderError'));
  }
}
