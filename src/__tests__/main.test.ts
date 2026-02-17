const createDepsMock = jest.fn();

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

jest.mock('@/create-deps', () => ({
  createDeps: createDepsMock,
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
import { createDeps } from '@/create-deps';
import { registerCommands } from '@/commands/register';
import type { Deps } from '@/deps';
import { registerEvents } from '@/events/register';
import { initI18n } from '@/i18n';
import { registerSettings } from '@/settings/register';
import { registerUI } from '@/ui/register';

const mockedCreateDeps = createDeps as jest.MockedFunction<typeof createDeps>;
const mockedRegisterCommands = registerCommands as jest.MockedFunction<typeof registerCommands>;
const mockedRegisterEvents = registerEvents as jest.MockedFunction<typeof registerEvents>;
const mockedRegisterUI = registerUI as jest.MockedFunction<typeof registerUI>;
const mockedRegisterSettings = registerSettings as jest.MockedFunction<typeof registerSettings>;
const mockedInitI18n = initI18n as jest.MockedFunction<typeof initI18n>;

describe('VaultWordCloudPlugin lifecycle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('onload initializes i18n, dependencies, and integration points', async () => {
    const deps = createDepsFixture();
    mockedCreateDeps.mockResolvedValue(deps);
    const plugin = createPlugin();

    await plugin.onload();

    expect(mockedInitI18n).toHaveBeenCalledTimes(1);
    expect(mockedCreateDeps).toHaveBeenCalledWith(plugin);
    expect(mockedRegisterCommands).toHaveBeenCalledWith(plugin, deps);
    expect(mockedRegisterEvents).toHaveBeenCalledWith(plugin, deps);
    expect(mockedRegisterUI).toHaveBeenCalledWith(plugin, deps);
    expect(mockedRegisterSettings).toHaveBeenCalledWith(plugin, deps);
  });

  test('onunload triggers dependency cleanup', async () => {
    const deps = createDepsFixture();
    mockedCreateDeps.mockResolvedValue(deps);
    const plugin = createPlugin();

    await plugin.onload();
    plugin.onunload();

    expect(deps.dispose).toHaveBeenCalledTimes(1);
  });

  test('onload failure during registration disposes dependencies and rethrows', async () => {
    const deps = createDepsFixture();
    mockedCreateDeps.mockResolvedValue(deps);
    mockedRegisterCommands.mockImplementation(() => {
      throw new Error('registration failed');
    });
    const plugin = createPlugin();

    await expect(plugin.onload()).rejects.toThrow('registration failed');
    expect(deps.dispose).toHaveBeenCalledTimes(1);
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
