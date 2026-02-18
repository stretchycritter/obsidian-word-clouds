const mockSettingsLoad = jest.fn();
const mockSettingsDispose = jest.fn();
const mockCoordinatorDispose = jest.fn();

jest.mock(
  'obsidian',
  () => ({
    Plugin: class {
      app: unknown;

      constructor(app: unknown) {
        this.app = app;
      }
    },
  }),
  { virtual: true },
);

jest.mock('@/events/coordinator', () => ({
  EventCoordinator: jest.fn().mockImplementation(() => ({
    dispose: mockCoordinatorDispose,
  })),
}));

jest.mock('@/services/obsidian-service', () => ({
  ObsidianService: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@/settings/settings-service', () => ({
  SettingsService: jest.fn().mockImplementation(() => ({
    load: mockSettingsLoad,
    dispose: mockSettingsDispose,
  })),
}));

jest.mock('@/services/wordcloud-services', () => ({
  WordCloudAppService: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@/wordcloud/application/wordcloud-service', () => ({
  WordCloudService: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@/commands/register', () => ({
  registerCommands: jest.fn(),
}));

jest.mock('@/events/register', () => ({
  registerEvents: jest.fn(),
}));

jest.mock('@/ui/register', () => ({
  registerUI: jest.fn(),
}));

jest.mock('@/settings/register', () => ({
  registerSettings: jest.fn(),
}));

jest.mock('@/i18n', () => ({
  initI18n: jest.fn(),
}));

import VaultWordCloudPlugin from '@/main';
import * as mainModule from '@/main';
import { registerCommands } from '@/commands/register';
import type { Deps } from '@/types';
import { registerEvents } from '@/events/register';
import { initI18n } from '@/i18n';
import { registerSettings } from '@/settings/register';
import { registerUI } from '@/ui/register';
import { EventCoordinator } from '@/events/coordinator';
import { ObsidianService } from '@/services/obsidian-service';
import { SettingsService } from '@/settings/settings-service';
import { WordCloudAppService } from '@/services/wordcloud-services';
import { WordCloudService } from '@/wordcloud/application/wordcloud-service';

const mockedRegisterCommands = registerCommands as jest.MockedFunction<typeof registerCommands>;
const mockedRegisterEvents = registerEvents as jest.MockedFunction<typeof registerEvents>;
const mockedRegisterUI = registerUI as jest.MockedFunction<typeof registerUI>;
const mockedRegisterSettings = registerSettings as jest.MockedFunction<typeof registerSettings>;
const mockedInitI18n = initI18n as jest.MockedFunction<typeof initI18n>;
const mockedEventCoordinator = EventCoordinator as unknown as jest.MockedClass<typeof EventCoordinator>;
const mockedObsidianService = ObsidianService as unknown as jest.MockedClass<typeof ObsidianService>;
const mockedSettingsService = SettingsService as unknown as jest.MockedClass<typeof SettingsService>;
const mockedWordCloudAppService = WordCloudAppService as unknown as jest.MockedClass<typeof WordCloudAppService>;
const mockedWordCloudService = WordCloudService as unknown as jest.MockedClass<typeof WordCloudService>;

describe('VaultWordCloudPlugin lifecycle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSettingsLoad.mockResolvedValue(undefined);
  });

  test('onload initializes i18n, dependencies, and integration points', async () => {
    const deps = createDepsFixture();
    const plugin = createPlugin();
    const initializeDependenciesSpy = jest
      .spyOn(plugin as unknown as { initializeDependencies: () => Promise<Deps> }, 'initializeDependencies')
      .mockResolvedValue(deps);

    await plugin.onload();

    expect(mockedInitI18n).toHaveBeenCalledTimes(1);
    expect(initializeDependenciesSpy).toHaveBeenCalledTimes(1);
    expect(mockedRegisterCommands).toHaveBeenCalledWith(plugin, deps);
    expect(mockedRegisterEvents).toHaveBeenCalledWith(plugin, deps);
    expect(mockedRegisterUI).toHaveBeenCalledWith(plugin, deps);
    expect(mockedRegisterSettings).toHaveBeenCalledWith(plugin, deps);
  });

  test('onunload triggers dependency cleanup', async () => {
    const deps = createDepsFixture();
    const plugin = createPlugin();
    jest
      .spyOn(plugin as unknown as { initializeDependencies: () => Promise<Deps> }, 'initializeDependencies')
      .mockResolvedValue(deps);

    await plugin.onload();
    plugin.onunload();

    expect(deps.dispose).toHaveBeenCalledTimes(1);
  });

  test('onload failure during registration disposes dependencies and rethrows', async () => {
    const deps = createDepsFixture();
    mockedRegisterCommands.mockImplementation(() => {
      throw new Error('registration failed');
    });
    const plugin = createPlugin();
    jest
      .spyOn(plugin as unknown as { initializeDependencies: () => Promise<Deps> }, 'initializeDependencies')
      .mockResolvedValue(deps);

    await expect(plugin.onload()).rejects.toThrow('registration failed');
    expect(deps.dispose).toHaveBeenCalledTimes(1);
  });
});

describe('createDeps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSettingsLoad.mockResolvedValue(undefined);
  });

  test('initializes settings and constructs dependency graph', async () => {
    const plugin = createPlugin();

    const deps = await mainModule.createDeps(plugin);

    expect(mockedSettingsService).toHaveBeenCalledWith(plugin);
    expect(mockSettingsLoad).toHaveBeenCalledTimes(1);
    expect(mockedObsidianService).toHaveBeenCalledWith(plugin.app);
    expect(mockedWordCloudService).toHaveBeenCalledWith(plugin.app);
    expect(mockedWordCloudAppService).toHaveBeenCalledTimes(1);
    expect(mockedEventCoordinator).toHaveBeenCalledTimes(1);

    const settingsInstance = mockedSettingsService.mock.results[0]?.value;
    const obsidianInstance = mockedObsidianService.mock.results[0]?.value;
    const processorInstance = mockedWordCloudService.mock.results[0]?.value;
    const appServiceInstance = mockedWordCloudAppService.mock.results[0]?.value;
    const coordinatorInstance = mockedEventCoordinator.mock.results[0]?.value;

    expect(mockedWordCloudAppService).toHaveBeenCalledWith(
      plugin.app,
      obsidianInstance,
      processorInstance,
      settingsInstance,
    );
    expect(deps.settingsService).toBe(settingsInstance);
    expect(deps.services.obsidian).toBe(obsidianInstance);
    expect(deps.services.wordCloud).toBe(appServiceInstance);
    expect(deps.coordinator).toBe(coordinatorInstance);

    deps.dispose();

    expect(mockCoordinatorDispose).toHaveBeenCalledTimes(1);
    expect(mockSettingsDispose).toHaveBeenCalledTimes(1);
  });

  test('throws when settings load fails and skips downstream service creation', async () => {
    const plugin = createPlugin();
    mockSettingsLoad.mockRejectedValueOnce(new Error('load failed'));

    await expect(mainModule.createDeps(plugin)).rejects.toThrow('load failed');

    expect(mockedObsidianService).not.toHaveBeenCalled();
    expect(mockedWordCloudService).not.toHaveBeenCalled();
    expect(mockedWordCloudAppService).not.toHaveBeenCalled();
    expect(mockedEventCoordinator).not.toHaveBeenCalled();
  });
});

function createPlugin(): VaultWordCloudPlugin {
  return new VaultWordCloudPlugin({ workspace: {} } as never, {} as never);
}

type DepsFixture = Deps & { dispose: jest.Mock };

function createDepsFixture(): DepsFixture {
  return {
    settingsService: {},
    services: {
      obsidian: {},
      wordCloud: {},
    },
    coordinator: {},
    dispose: jest.fn(),
  } as unknown as DepsFixture;
}
