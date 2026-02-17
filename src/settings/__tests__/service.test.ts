import type { Plugin } from 'obsidian';
import { SettingsService } from '../service';
import { DEFAULT_SETTINGS } from '../types';

describe('SettingsService', () => {
  test('load falls back to defaults when stored data is invalid', async () => {
    const plugin = createPluginMock('invalid payload');
    const service = new SettingsService(plugin);

    await service.load();

    expect(service.getSnapshot()).toEqual(DEFAULT_SETTINGS);
  });

  test('load normalizes exclusion words and updateFilters persists normalized values', async () => {
    const plugin = createPluginMock({
      exclusionListWords: ['  Alpha', 'alpha', ' ', 100],
    });
    const service = new SettingsService(plugin);
    const listener = jest.fn();

    await service.load();
    service.onChange(listener);
    await service.updateFilters({
      frequency: {
        minCount: 100,
        maxCount: 2,
      },
    });

    expect(service.getSnapshot().exclusionListWords).toEqual(['alpha']);
    expect(plugin.saveData).toHaveBeenCalledTimes(1);
    expect(plugin.saveData).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({
          frequency: {
            minCount: 2,
            maxCount: 100,
          },
        }),
      }),
    );
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

function createPluginMock(loadValue: unknown): Plugin {
  return {
    loadData: jest.fn().mockResolvedValue(loadValue),
    saveData: jest.fn().mockResolvedValue(undefined),
  } as unknown as Plugin;
}
