import { scaleOrdinal } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { select } from 'd3-selection';
import { Menu } from 'obsidian';
import type { RenderSettings, RotationPreset, WordTextMetric } from '@/settings/types';
import type { WordCloudRenderOptions } from '@/services/types';
import type { WeightedWord } from '@/wordcloud/types';
import {
  renderWordCloudOverlayControls,
  sanitizeWordCloudExportBaseName,
} from '../components/word-cloud-overlay-controls';

function buildDeterministicRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickRotation(random: () => number, preset: RotationPreset): number {
  if (preset === 'horizontal') {
    return 0;
  }

  if (preset === 'mostly-horizontal') {
    return random() > 0.85 ? 90 : 0;
  }

  if (preset === 'vertical') {
    return random() > 0.2 ? 90 : 0;
  }

  const angles = [-90, -45, 0, 45, 90];
  return angles[Math.floor(random() * angles.length)];
}

function formatWordMetricValue(
  word: WeightedWord,
  totalCount: number,
  metric: WordTextMetric,
): string {
  if (metric === 'frequency') {
    const percent = (word.count / Math.max(1, totalCount)) * 100;
    return `${percent.toFixed(percent >= 10 ? 1 : 2).replace(/\.?0+$/, '')}%`;
  }

  return String(word.count);
}

function formatWordTitle(word: WeightedWord, totalCount: number): string {
  return `${word.text} (${word.count}, ${formatWordMetricValue(word, totalCount, 'frequency')})`;
}

function getWordLabel(word: WeightedWord, renderSettings: RenderSettings, totalCount: number, metric: WordTextMetric): string {
  if (!renderSettings.showCountInWordText || word.count < renderSettings.countLabelMinCount) {
    return word.text;
  }

  const formattedValue = formatWordMetricValue(word, totalCount, metric);

  return `${word.text} (${formattedValue})`;
}

type LayoutWord = WeightedWord & {
  baseText: string;
  layoutText: string;
  x?: number;
  y?: number;
  rotate?: number;
};

type ViewportControls = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  shouldSuppressWordClick: () => boolean;
};

export async function drawWordCloud(options: WordCloudRenderOptions, renderSettings: RenderSettings): Promise<void> {
  const {
    containerEl,
    words,
    ariaLabel,
    onWordClick,
    onExcludeInCloud,
    onExcludeInVault,
    onProgress,
    onRefresh,
  } = options;
  const exportBaseName = sanitizeWordCloudExportBaseName(options.exportBaseName ?? 'word-cloud');
  const enableMouseInteractions = options.enableViewportInteraction ?? renderSettings.enableMouseInteractions;
  const enableExport = options.enableExport ?? renderSettings.enableExporting;
  const enableOverlayControls = options.enableOverlayControls ?? renderSettings.enableControls;
  const enableViewportInteraction = enableMouseInteractions;
  const showRefreshControl = options.showRefreshControl ?? true;
  const showZoomControls = options.showZoomControls ?? true;
  const showEditControl = options.showEditControl ?? false;
  const width = Math.max(320, containerEl.clientWidth || 700);
  const height = Math.max(320, containerEl.clientHeight || 500);
  const random = renderSettings.deterministicLayout ? buildDeterministicRandom(renderSettings.randomSeed) : Math.random;
  const totalWordCount = words.reduce((total, word) => total + word.count, 0);
  let activeWordTextMetric: WordTextMetric = renderSettings.wordTextMetric;
  const layoutWords: LayoutWord[] = words.map((word) => ({
    ...word,
    baseText: word.text,
    layoutText: getWordLabel(word, renderSettings, totalWordCount, activeWordTextMetric),
  }));

  containerEl.classList.add('word-cloud-render-container');

  const svg = select(containerEl)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('role', 'img')
    .attr('aria-label', ariaLabel);

  const viewportGroup = svg.append('g').attr('class', 'word-cloud-viewport');
  const g = viewportGroup.append('g').attr('transform', `translate(${width / 2},${height / 2})`);
  const viewportControls = enableViewportInteraction
    ? setupViewportControls(svg.node(), viewportGroup.node(), width, height)
    : createStaticViewportControls();

  const color = scaleOrdinal<string, string>(schemeTableau10);
  const { default: cloud } = await import('d3-cloud');
  const performance = getLayoutPerformanceProfile(renderSettings.performanceMode);
  const reportProgress = createThrottledProgress(onProgress, performance.progressThrottleMs);
  const layoutTimeInterval = performance.layoutTimeIntervalMs ?? Math.max(8, Math.round(renderSettings.layoutTimeIntervalMs));

  await new Promise<void>((resolve) => {
    let laidOutWords = 0;
    const totalWords = Math.max(1, layoutWords.length);

    cloud<LayoutWord>()
      .size([width, height])
      .words(layoutWords)
      .text((d) => d.layoutText)
      .timeInterval(layoutTimeInterval)
      .padding(Math.max(0, Math.round(renderSettings.wordPadding)))
      .spiral(renderSettings.spiral)
      .rotate(() => pickRotation(random, renderSettings.rotationPreset))
      .font(renderSettings.fontFamily || 'sans-serif')
      .fontSize((d) => d.size)
      .random(random)
      .on('word', () => {
        laidOutWords += 1;
        if (laidOutWords % performance.wordProgressStride === 0) {
          const layoutPercent = Math.min(99, Math.round((laidOutWords / totalWords) * 100));
          reportProgress(`Laying out words... ${laidOutWords}/${layoutWords.length}`, layoutPercent);
        }
      })
      .on('end', (layoutWords) => {
        const textSelection = g.selectAll('text')
          .data(layoutWords)
          .enter()
          .append('text')
          .style('font-size', (d) => `${d.size}px`)
          .style('font-family', renderSettings.fontFamily || 'sans-serif')
          .style('fill', (_, i) => color(String(i)))
          .style('cursor', enableMouseInteractions ? 'pointer' : 'default')
          .attr('tabindex', 0)
          .attr('text-anchor', 'middle')
          .attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0}) rotate(${d.rotate ?? 0})`)
          .text((d) => d.layoutText)
          .on('click', (_, d) => {
            if (!enableMouseInteractions) {
              return;
            }
            if (viewportControls.shouldSuppressWordClick()) {
              return;
            }
            onWordClick(d.baseText);
          })
          .on('keydown', (event: KeyboardEvent, d) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onWordClick(d.baseText);
              return;
            }

            if ((onExcludeInCloud || onExcludeInVault) && (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10'))) {
              event.preventDefault();
              openExcludeWordMenuAtFocusedWord(event.currentTarget, d.baseText, onExcludeInCloud, onExcludeInVault);
            }
          })
          .on('contextmenu', (event: MouseEvent, d) => {
            if (!enableMouseInteractions) {
              return;
            }
            if (!onExcludeInCloud && !onExcludeInVault) {
              return;
            }

            event.preventDefault();
            event.stopPropagation();
            openExcludeWordMenuAtPointer(event, d.baseText, onExcludeInCloud, onExcludeInVault);
          });

        textSelection
          .append('title')
          .text((d) => formatWordTitle(d, totalWordCount));

        const applyWordTextMetric = (metric: WordTextMetric): void => {
          activeWordTextMetric = metric;
          textSelection.text((d) => getWordLabel(d, renderSettings, totalWordCount, metric));
          textSelection.select('title').text((d) => formatWordTitle(d, totalWordCount));
        };

        reportProgress('Rendering complete.', 100);
        if (enableOverlayControls) {
          renderWordCloudOverlayControls({
            containerEl,
            svgEl: svg.node(),
            exportBaseName,
            enableExport,
            onRefresh,
            onEdit: options.onEdit,
            viewportControls,
            showRefreshControl,
            showZoomControls,
            showEditControl,
            showWordMetricToggleControl: renderSettings.showCountInWordText && renderSettings.showWordTextMetricToggle,
            getCurrentWordMetric: () => activeWordTextMetric,
            onToggleWordMetric: () => {
              applyWordTextMetric(activeWordTextMetric === 'count' ? 'frequency' : 'count');
            },
          });
        }

        resolve();
      })
      .start();
  });
}

function openExcludeWordMenuAtPointer(
  event: MouseEvent,
  word: string,
  onExcludeInCloud: ((word: string) => void | Promise<void>) | undefined,
  onExcludeInVault: ((word: string) => void | Promise<void>) | undefined,
): void {
  const menu = new Menu();
  addExcludeMenuItems(menu, word, onExcludeInCloud, onExcludeInVault);
  menu.showAtMouseEvent(event);
}

function openExcludeWordMenuAtFocusedWord(
  target: EventTarget | null,
  word: string,
  onExcludeInCloud: ((word: string) => void | Promise<void>) | undefined,
  onExcludeInVault: ((word: string) => void | Promise<void>) | undefined,
): void {
  if (!(target instanceof SVGGraphicsElement)) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const menu = new Menu();
  addExcludeMenuItems(menu, word, onExcludeInCloud, onExcludeInVault);
  menu.showAtPosition({
    x: Math.round(rect.left + (rect.width / 2)),
    y: Math.round(rect.bottom),
  });
}

function addExcludeMenuItems(
  menu: Menu,
  word: string,
  onExcludeInCloud: ((word: string) => void | Promise<void>) | undefined,
  onExcludeInVault: ((word: string) => void | Promise<void>) | undefined,
): void {
  if (onExcludeInCloud) {
    menu.addItem((item) => {
      item
        .setTitle('Exclude in cloud')
        .setIcon('list-x')
        .onClick(() => {
          void onExcludeInCloud(word);
        });
    });
  }

  if (onExcludeInVault) {
    menu.addItem((item) => {
      item
        .setTitle('Exclude in vault')
        .setIcon('cloud-off')
        .onClick(() => {
          void onExcludeInVault(word);
        });
    });
  }

  if (!onExcludeInCloud && !onExcludeInVault) {
    menu.addItem((item) => {
      item
        .setTitle('Exclude unavailable')
        .setIcon('slash')
        .setDisabled(true);
    });
  }
}

function createStaticViewportControls(): ViewportControls {
  return {
    zoomIn: () => undefined,
    zoomOut: () => undefined,
    resetView: () => undefined,
    shouldSuppressWordClick: () => false,
  };
}

function setupViewportControls(
  svgEl: SVGSVGElement | null,
  viewportEl: SVGGElement | null,
  width: number,
  height: number,
): ViewportControls {
  if (!svgEl || !viewportEl) {
    return {
      zoomIn: () => undefined,
      zoomOut: () => undefined,
      resetView: () => undefined,
      shouldSuppressWordClick: () => false,
    };
  }

  let panX = 0;
  let panY = 0;
  let zoom = 1;
  let suppressWordClickUntil = 0;
  let pointerId: number | null = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let pointerMoved = false;
  let isDragging = false;
  const minZoom = 0.35;
  const maxZoom = 4.5;
  const dragStartThresholdPx = 7;

  const clampZoom = (value: number): number => {
    if (Number.isNaN(value)) {
      return zoom;
    }
    return Math.min(maxZoom, Math.max(minZoom, value));
  };

  const applyTransform = (): void => {
    viewportEl.setAttribute('transform', `translate(${panX},${panY}) scale(${zoom})`);
  };

  const zoomAt = (x: number, y: number, factor: number): void => {
    if (!Number.isFinite(factor) || factor <= 0) {
      return;
    }

    const nextZoom = clampZoom(zoom * factor);
    if (nextZoom === zoom) {
      return;
    }

    const worldX = (x - panX) / zoom;
    const worldY = (y - panY) / zoom;
    panX = x - (worldX * nextZoom);
    panY = y - (worldY * nextZoom);
    zoom = nextZoom;
    applyTransform();
  };

  const nudgePan = (deltaX: number, deltaY: number): void => {
    panX += deltaX;
    panY += deltaY;
    applyTransform();
  };

  const zoomIn = (): void => zoomAt(width / 2, height / 2, 1.18);
  const zoomOut = (): void => zoomAt(width / 2, height / 2, 1 / 1.18);
  const resetView = (): void => {
    panX = 0;
    panY = 0;
    zoom = 1;
    applyTransform();
  };

  applyTransform();
  svgEl.classList.add('word-cloud-panzoom-surface');
  svgEl.setAttribute('tabindex', '0');
  svgEl.setAttribute(
    'aria-keyshortcuts',
    '+, -, 0, ArrowLeft, ArrowRight, ArrowUp, ArrowDown',
  );

  svgEl.addEventListener('pointerdown', (event: PointerEvent) => {
    if (event.pointerType !== 'touch' && event.button !== 0) {
      return;
    }

    svgEl.focus({ preventScroll: true });
    pointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    pointerMoved = false;
    isDragging = false;
  });

  svgEl.addEventListener('pointermove', (event: PointerEvent) => {
    if (pointerId !== event.pointerId) {
      return;
    }

    if (!isDragging) {
      const dragDistance = Math.hypot(event.clientX - dragStartX, event.clientY - dragStartY);
      if (dragDistance < dragStartThresholdPx) {
        return;
      }

      isDragging = true;
      pointerMoved = true;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      svgEl.setPointerCapture(event.pointerId);
      svgEl.classList.add('is-panning');
      event.preventDefault();
      return;
    }

    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;

    nudgePan(deltaX, deltaY);
    event.preventDefault();
  });

  svgEl.addEventListener('pointerup', (event: PointerEvent) => {
    if (pointerId !== event.pointerId) {
      return;
    }

    if (pointerMoved) {
      suppressWordClickUntil = Date.now() + 240;
    }
    pointerId = null;
    pointerMoved = false;
    isDragging = false;
    svgEl.classList.remove('is-panning');
    if (svgEl.hasPointerCapture(event.pointerId)) {
      svgEl.releasePointerCapture(event.pointerId);
    }
  });

  svgEl.addEventListener('pointercancel', (event: PointerEvent) => {
    if (pointerId !== event.pointerId) {
      return;
    }

    pointerId = null;
    pointerMoved = false;
    isDragging = false;
    svgEl.classList.remove('is-panning');
    if (svgEl.hasPointerCapture(event.pointerId)) {
      svgEl.releasePointerCapture(event.pointerId);
    }
  });

  svgEl.addEventListener(
    'wheel',
    (event: WheelEvent) => {
      event.preventDefault();
      const speed = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 0.04 : 0.0023;
      const zoomFactor = Math.exp(-event.deltaY * speed);
      zoomAt(event.offsetX, event.offsetY, zoomFactor);
    },
    { passive: false },
  );

  svgEl.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === '+' || event.key === '=' || event.key === 'NumpadAdd') {
      event.preventDefault();
      zoomIn();
      return;
    }

    if (event.key === '-' || event.key === '_' || event.key === 'NumpadSubtract') {
      event.preventDefault();
      zoomOut();
      return;
    }

    if (event.key === '0') {
      event.preventDefault();
      resetView();
      return;
    }

    const panStep = 36;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      nudgePan(panStep, 0);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nudgePan(-panStep, 0);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      nudgePan(0, panStep);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      nudgePan(0, -panStep);
    }
  });

  return {
    zoomIn,
    zoomOut,
    resetView,
    shouldSuppressWordClick: () => Date.now() < suppressWordClickUntil,
  };
}

function getLayoutPerformanceProfile(mode: RenderSettings['performanceMode']): {
  progressThrottleMs: number;
  wordProgressStride: number;
  layoutTimeIntervalMs: number | null;
} {
  if (mode === 'full-speed') {
    return {
      progressThrottleMs: 1_000_000,
      wordProgressStride: Number.MAX_SAFE_INTEGER,
      layoutTimeIntervalMs: Infinity,
    };
  }

  if (mode === 'throttled') {
    return {
      progressThrottleMs: 350,
      wordProgressStride: 16,
      layoutTimeIntervalMs: 8,
    };
  }

  return {
    progressThrottleMs: 80,
    wordProgressStride: 4,
    layoutTimeIntervalMs: null,
  };
}

function createThrottledProgress(
  onProgress: ((message: string, percent: number) => void) | undefined,
  minIntervalMs: number,
): (message: string, percent: number) => void {
  if (!onProgress) {
    return () => undefined;
  }

  let lastReportedAt = 0;
  let lastPercent = -1;

  return (message: string, percent: number) => {
    const now = Date.now();
    if (percent !== 100 && percent === lastPercent && now - lastReportedAt < minIntervalMs) {
      return;
    }
    if (percent !== 100 && now - lastReportedAt < minIntervalMs) {
      return;
    }

    lastReportedAt = now;
    lastPercent = percent;
    onProgress(message, percent);
  };
}
