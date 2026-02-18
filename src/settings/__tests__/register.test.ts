import type { Plugin } from 'obsidian';
import type { Deps } from '@/types';
import { registerSettings } from '../register';
import { VaultWordCloudSettingTab } from '../tab';

jest.mock('../tab', () => ({
  VaultWordCloudSettingTab: jest.fn().mockImplementation(() => ({ mocked: 'settings-tab' })),
}));

const mockedVaultWordCloudSettingTab = VaultWordCloudSettingTab as unknown as jest.MockedClass<typeof VaultWordCloudSettingTab>;

describe('registerSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registers the settings tab with the plugin', () => {
    const plugin = createPluginMock();
    const deps = createDepsMock();

    registerSettings(plugin, deps);

    expect(mockedVaultWordCloudSettingTab).toHaveBeenCalledWith(plugin, deps.services.wordCloud);

    const createdTab = mockedVaultWordCloudSettingTab.mock.results[0]?.value;
    expect(plugin.addSettingTab).toHaveBeenCalledWith(createdTab);
  });
});

function createPluginMock(): Plugin & { addSettingTab: jest.Mock } {
  return {
    app: {},
    addSettingTab: jest.fn(),
  } as unknown as Plugin & { addSettingTab: jest.Mock };
}

function createDepsMock(): Deps {
  return {
    settingsService: {},
    services: {
      obsidian: {},
      wordCloud: { mock: 'word-cloud-service' },
    },
    coordinator: {},
    dispose: jest.fn(),
  } as unknown as Deps;
}
