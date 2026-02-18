import type { RenderSettings } from '@/settings/types';

export function mergeRenderSettings(
  defaults: RenderSettings,
  override?: Partial<RenderSettings>,
): RenderSettings {
  if (!override) {
    return { ...defaults };
  }

  return {
    ...defaults,
    ...override,
  };
}
