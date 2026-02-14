import { scaleOrdinal } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { select } from 'd3-selection';
import type { RenderSettings, RotationPreset, WordCloudRenderOptions, WeightedWord } from '../types';

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

function getWordLabel(word: WeightedWord, renderSettings: RenderSettings): string {
  if (!renderSettings.showCountInWordText || word.count < renderSettings.countLabelMinCount) {
    return word.text;
  }

  if (renderSettings.countLabelFormat === 'dot') {
    return `${word.text} · ${word.count}`;
  }

  if (renderSettings.countLabelFormat === 'colon') {
    return `${word.text}: ${word.count}`;
  }

  return `${word.text} (${word.count})`;
}

type LayoutWord = WeightedWord & {
  baseText: string;
  layoutText: string;
};

export async function drawWordCloud(options: WordCloudRenderOptions, renderSettings: RenderSettings): Promise<void> {
  const { containerEl, words, ariaLabel, onWordClick, onProgress } = options;
  const exportBaseName = sanitizeFileName(options.exportBaseName ?? 'word-cloud');
  const enableExport = options.enableExport ?? true;
  const width = Math.max(320, containerEl.clientWidth || 700);
  const height = Math.max(320, containerEl.clientHeight || 500);
  const random = renderSettings.deterministicLayout ? buildDeterministicRandom(renderSettings.randomSeed) : Math.random;
  const layoutWords: LayoutWord[] = words.map((word) => ({
    ...word,
    baseText: word.text,
    layoutText: getWordLabel(word, renderSettings),
  }));

  containerEl.classList.add('word-cloud-render-container');

  const svg = select(containerEl)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('role', 'img')
    .attr('aria-label', ariaLabel);

  const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

  const color = scaleOrdinal<string, string>(schemeTableau10);
  const { default: cloud } = await import('d3-cloud');
  const performance = getLayoutPerformanceProfile(renderSettings.progressDetail);
  const reportProgress = createThrottledProgress(onProgress, performance.progressThrottleMs);
  const layoutTimeInterval = renderSettings.progressDetail === 'unhinged'
    ? Infinity
    : Math.max(8, Math.round(renderSettings.layoutTimeIntervalMs));

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
        g.selectAll('text')
          .data(layoutWords)
          .enter()
          .append('text')
          .style('font-size', (d) => `${d.size}px`)
          .style('font-family', renderSettings.fontFamily || 'sans-serif')
          .style('fill', (_, i) => color(String(i)))
          .style('cursor', 'pointer')
          .attr('tabindex', 0)
          .attr('text-anchor', 'middle')
          .attr('transform', (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
          .text((d) => d.layoutText)
          .on('click', (_, d) => {
            onWordClick(d.baseText);
          })
          .on('keydown', (event: KeyboardEvent, d) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onWordClick(d.baseText);
            }
          })
          .append('title')
          .text((d) => `${d.baseText}: ${d.count} ${d.count === 1 ? 'occurrence' : 'occurrences'}`);

        reportProgress('Rendering complete.', 100);
        if (enableExport) {
          renderExportControls(containerEl, svg.node(), exportBaseName);
        }

        resolve();
      })
      .start();
  });
}

function renderExportControls(containerEl: HTMLDivElement, svgEl: SVGSVGElement | null, exportBaseName: string): void {
  if (!svgEl) {
    return;
  }

  const controlsEl = containerEl.createDiv({ cls: 'word-cloud-export-controls' });
  const menuButton = controlsEl.createEl('button', {
    cls: 'word-cloud-menu-button',
    text: '⋯',
  });
  menuButton.setAttr('aria-label', 'Word cloud options');

  const menuEl = controlsEl.createDiv({ cls: 'word-cloud-menu' });
  menuEl.setAttr('hidden', 'true');
  let removeOutsideListener: (() => void) | null = null;

  const toggleMenu = (open: boolean): void => {
    if (open) {
      menuEl.removeAttribute('hidden');
      const onOutsideClick = (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Node)) {
          toggleMenu(false);
          return;
        }
        if (!controlsEl.contains(target)) {
          toggleMenu(false);
        }
      };
      document.addEventListener('mousedown', onOutsideClick, true);
      removeOutsideListener = () => {
        document.removeEventListener('mousedown', onOutsideClick, true);
        removeOutsideListener = null;
      };
    } else {
      menuEl.setAttr('hidden', 'true');
      if (removeOutsideListener) {
        removeOutsideListener();
      }
    }
  };

  const makeMenuItem = (label: string, format: 'svg' | 'png' | 'jpeg') => {
    const button = menuEl.createEl('button', { cls: 'word-cloud-menu-item', text: `Export ${label}` });
    button.setAttr('aria-label', `Export as ${label}`);
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        await exportSvg(svgEl, format, exportBaseName);
      } catch (error) {
        console.error('Word clouds: export failed', error);
      } finally {
        toggleMenu(false);
      }
    });
  };

  makeMenuItem('SVG', 'svg');
  makeMenuItem('PNG', 'png');
  makeMenuItem('JPEG', 'jpeg');

  menuButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMenu(menuEl.hasAttribute('hidden'));
  });

  menuButton.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleMenu(false);
    }
  });

  menuEl.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      toggleMenu(false);
      menuButton.focus();
    }
  });
}

async function exportSvg(svgEl: SVGSVGElement, format: 'svg' | 'png' | 'jpeg', baseName: string): Promise<void> {
  const svgText = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });

  if (format === 'svg') {
    triggerBlobDownload(svgBlob, `${baseName}.svg`);
    return;
  }

  const width = Number(svgEl.getAttribute('width') ?? svgEl.viewBox.baseVal.width ?? 800);
  const height = Number(svgEl.getAttribute('height') ?? svgEl.viewBox.baseVal.height ?? 600);
  const bitmapBlob = await rasterizeSvg(svgBlob, width, height, format);
  triggerBlobDownload(bitmapBlob, `${baseName}.${format === 'png' ? 'png' : 'jpg'}`);
}

async function rasterizeSvg(
  svgBlob: Blob,
  width: number,
  height: number,
  format: 'png' | 'jpeg',
): Promise<Blob> {
  const svgUrl = URL.createObjectURL(svgBlob);
  const image = await loadImage(svgUrl);
  URL.revokeObjectURL(svgUrl);

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context unavailable');
  }

  if (format === 'jpeg') {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create bitmap blob'));
        return;
      }
      resolve(blob);
    }, format === 'png' ? 'image/png' : 'image/jpeg', 0.92);
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load SVG image'));
    image.src = url;
  });
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function sanitizeFileName(value: string): string {
  return value.trim().replace(/[^a-z0-9-_]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'word-cloud';
}

function getLayoutPerformanceProfile(detail: RenderSettings['progressDetail']): {
  progressThrottleMs: number;
  wordProgressStride: number;
} {
  if (detail === 'unhinged') {
    return {
      progressThrottleMs: 1_000_000,
      wordProgressStride: Number.MAX_SAFE_INTEGER,
    };
  }

  if (detail === 'detailed') {
    return {
      progressThrottleMs: 30,
      wordProgressStride: 1,
    };
  }

  if (detail === 'minimal') {
    return {
      progressThrottleMs: 220,
      wordProgressStride: 12,
    };
  }

  return {
    progressThrottleMs: 80,
    wordProgressStride: 4,
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
