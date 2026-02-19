import type { RenderSettings } from '@/settings/types';
import { DEFAULT_SETTINGS } from '@/settings/constants';
import { mergeRenderSettings } from '@/core/renderers/render-settings';

describe('mergeRenderSettings', () => {
  test('returns a copy of defaults when override is undefined', () => {
    const defaults = createDefaults();

    const merged = mergeRenderSettings(defaults);

    expect(merged).toEqual(defaults);
    expect(merged).not.toBe(defaults);
  });

  test('applies override values on top of defaults', () => {
    const defaults = createDefaults();

    const merged = mergeRenderSettings(defaults, {
      rotationPreset: 'vertical',
      minFontSize: 20,
      enableExporting: false,
    });

    expect(merged.rotationPreset).toBe('vertical');
    expect(merged.minFontSize).toBe(20);
    expect(merged.enableExporting).toBe(false);
    expect(merged.maxFontSize).toBe(defaults.maxFontSize);
  });

  test('does not mutate defaults or override objects', () => {
    const defaults = createDefaults();
    const override: Partial<RenderSettings> = {
      fontFamily: 'serif',
      layoutTimeIntervalMs: 42,
    };
    const defaultsBefore = { ...defaults };
    const overrideBefore = { ...override };

    void mergeRenderSettings(defaults, override);

    expect(defaults).toEqual(defaultsBefore);
    expect(override).toEqual(overrideBefore);
  });
});

function createDefaults(): RenderSettings {
  return { ...DEFAULT_SETTINGS.render };
}
