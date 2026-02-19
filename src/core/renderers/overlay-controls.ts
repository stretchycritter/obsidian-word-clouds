import { setIcon } from 'obsidian';
import type { WordTextMetric } from '@/settings/types';
import { t } from '@/i18n';

type WordCloudViewportControls = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
};

type WordCloudOverlayControlsOptions = {
  containerEl: HTMLDivElement;
  svgEl: SVGSVGElement | null;
  exportBaseName: string;
  enableExport: boolean;
  onRefresh: () => void | Promise<void>;
  onEdit: (() => void | Promise<void>) | undefined;
  viewportControls: WordCloudViewportControls;
  showRefreshControl: boolean;
  showZoomControls: boolean;
  showEditControl: boolean;
  showWordMetricToggleControl: boolean;
  getCurrentWordMetric: () => WordTextMetric;
  onToggleWordMetric: () => void;
};

function sanitizeWordCloudExportBaseName(value: string): string {
  return value.trim().replace(/[^a-z0-9-_]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'word-cloud';
}

function renderWordCloudOverlayControls(options: WordCloudOverlayControlsOptions): void {
  const {
    containerEl,
    svgEl,
    exportBaseName,
    enableExport,
    onRefresh,
    onEdit,
    viewportControls,
    showRefreshControl,
    showZoomControls,
    showEditControl,
    showWordMetricToggleControl,
    getCurrentWordMetric,
    onToggleWordMetric,
  } = options;

  if (!svgEl) {
    return;
  }

  const makeRefreshButton = (parentEl: HTMLDivElement): void => {
    if (!showRefreshControl) {
      return;
    }

    const refreshButton = parentEl.createEl('button', {
      cls: 'word-cloud-refresh-button',
    });
    refreshButton.type = 'button';
    setIcon(refreshButton, 'rotate-cw');
    refreshButton.setAttr('aria-label', t('ui.overlay.refreshWordCloud'));

    let isRefreshing = false;
    refreshButton.addEventListener('click', async (event) => {
      event.preventDefault();
      if (isRefreshing) {
        return;
      }

      isRefreshing = true;
      refreshButton.disabled = true;
      try {
        await onRefresh();
      } finally {
        if (refreshButton.isConnected) {
          refreshButton.disabled = false;
        }
        isRefreshing = false;
      }
    });
  };

  const makeEditButton = (parentEl: HTMLDivElement): void => {
    if (!showEditControl || !onEdit) {
      return;
    }

    const editButton = parentEl.createEl('button', {
      cls: 'word-cloud-edit-button',
    });
    editButton.type = 'button';
    setIcon(editButton, 'pencil');
    editButton.setAttr('aria-label', t('ui.overlay.editEmbeddedWordCloud'));

    let isEditing = false;
    editButton.addEventListener('click', async (event) => {
      event.preventDefault();
      if (isEditing) {
        return;
      }

      isEditing = true;
      editButton.disabled = true;
      try {
        await onEdit();
      } finally {
        if (editButton.isConnected) {
          editButton.disabled = false;
        }
        isEditing = false;
      }
    });
  };

  const makeWordMetricToggleButton = (parentEl: HTMLDivElement): void => {
    if (!showWordMetricToggleControl) {
      return;
    }

    const metricButton = parentEl.createEl('button', {
      cls: 'word-cloud-metric-button',
    });
    metricButton.type = 'button';

    const updateMetricButtonText = (): void => {
      const currentMetric = getCurrentWordMetric();
      const nextMetric = currentMetric === 'count' ? 'frequency' : 'count';
      metricButton.setText(currentMetric === 'count' ? '123' : '%');
      metricButton.setAttr('aria-label', t(`ui.overlay.metric.switchTo.${nextMetric}`));
      metricButton.setAttr('data-tooltip-position', 'top');
      metricButton.setAttr(
        'data-tooltip',
        t('ui.overlay.metric.tooltip').replace('{current}', currentMetric).replace('{next}', nextMetric),
      );
    };

    updateMetricButtonText();
    metricButton.addEventListener('click', () => {
      onToggleWordMetric();
      updateMetricButtonText();
    });
  };

  if (showZoomControls) {
    const viewControlsEl = containerEl.createDiv({ cls: 'word-cloud-view-controls' });
    const zoomOutButton = viewControlsEl.createEl('button', {
      cls: 'word-cloud-view-button',
    });
    zoomOutButton.type = 'button';
    setIcon(zoomOutButton, 'minus');
    zoomOutButton.setAttr('aria-label', t('ui.overlay.zoomOut'));
    zoomOutButton.addEventListener('click', () => viewportControls.zoomOut());

    const resetViewButton = viewControlsEl.createEl('button', {
      cls: 'word-cloud-view-button',
    });
    resetViewButton.type = 'button';
    setIcon(resetViewButton, 'locate-fixed');
    resetViewButton.setAttr('aria-label', t('ui.overlay.resetPanZoom'));
    resetViewButton.addEventListener('click', () => viewportControls.resetView());

    const zoomInButton = viewControlsEl.createEl('button', {
      cls: 'word-cloud-view-button',
    });
    zoomInButton.type = 'button';
    setIcon(zoomInButton, 'plus');
    zoomInButton.setAttr('aria-label', t('ui.overlay.zoomIn'));
    zoomInButton.addEventListener('click', () => viewportControls.zoomIn());
  }

  if (!enableExport) {
    if (!showZoomControls) {
      const fallbackControlsEl = containerEl.createDiv({ cls: 'word-cloud-export-controls' });
      makeWordMetricToggleButton(fallbackControlsEl);
      makeRefreshButton(fallbackControlsEl);
      makeEditButton(fallbackControlsEl);
    }
    return;
  }

  const exportControlsEl = containerEl.createDiv({ cls: 'word-cloud-export-controls' });
  const menuButton = exportControlsEl.createEl('button', {
    cls: 'word-cloud-menu-button',
    text: '⋯',
  });
  menuButton.setAttr('aria-label', t('ui.overlay.wordCloudOptions'));

  makeWordMetricToggleButton(exportControlsEl);
  makeRefreshButton(exportControlsEl);
  makeEditButton(exportControlsEl);

  const menuEl = exportControlsEl.createDiv({ cls: 'word-cloud-menu' });
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
        if (!exportControlsEl.contains(target)) {
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
    const button = menuEl.createEl('button', {
      cls: 'word-cloud-menu-item',
      text: t('ui.overlay.exportAs').replace('{format}', label),
    });
    button.setAttr('aria-label', t('ui.overlay.exportAs').replace('{format}', label));
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

export { renderWordCloudOverlayControls, sanitizeWordCloudExportBaseName };
