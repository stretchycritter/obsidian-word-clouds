import type { RenderSettings } from '@/settings/types';
import type { WeightedWord } from '@/core';

export type WordCloudRenderOptions = {
  containerEl: HTMLDivElement;
  words: WeightedWord[];
  ariaLabel: string;
  onWordClick: (word: string) => void;
  onExcludeInCloud?: (word: string) => void | Promise<void>;
  onExcludeInVault?: (word: string) => void | Promise<void>;
  onRefresh: () => void | Promise<void>;
  onEdit?: () => void | Promise<void>;
  onProgress?: (message: string, percent: number) => void;
  exportBaseName?: string;
  enableExport?: boolean;
  enableOverlayControls?: boolean;
  enableViewportInteraction?: boolean;
  enableWordClickSearch?: boolean;
  showRefreshControl?: boolean;
  showZoomControls?: boolean;
  showEditControl?: boolean;
  renderSettingsOverride?: Partial<RenderSettings>;
};
