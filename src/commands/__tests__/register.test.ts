import type { Plugin } from 'obsidian';
import type { Deps } from '@/types';
import { registerCommands } from '@/commands/register';
import { t } from '@/i18n';
import { EmbedWordCloudModal } from '@/ui';
import { insertEmbedAtCursor } from '@/services/note-service';

const mockT = t as jest.MockedFunction<typeof t>;
const mockedInsertEmbedAtCursor = insertEmbedAtCursor as jest.MockedFunction<typeof insertEmbedAtCursor>;
const mockedEmbedWordCloudModal = EmbedWordCloudModal as unknown as jest.MockedClass<typeof EmbedWordCloudModal>;
const mockModalOpenSpy = jest.fn();
const mockModalConstructorSpy = jest.fn();

jest.mock('@/i18n', () => ({
  t: jest.fn((key: string) => `translated:${key}`),
}));

jest.mock('@/ui', () => ({
  activateVaultWordCloudView: jest.fn(),
  activateNoteWordCloudView: jest.fn(),
  EmbedWordCloudModal: jest.fn().mockImplementation((app, service, onSubmit) => {
    mockModalConstructorSpy(app, service, onSubmit);
    return {
      open: mockModalOpenSpy,
    };
  }),
}));

jest.mock('@/services/note-service', () => ({
  insertEmbedAtCursor: jest.fn(),
}));

describe('registerCommands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registers embed word cloud in document command with the expected setup', () => {
    const plugin = createPluginMock();
    const deps = createDepsMock();

    registerCommands(plugin, deps);

    expect(plugin.addCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'embed-word-cloud-in-document',
        name: 'translated:commands.embedWordCloudInDocument',
      }),
    );
    expect(mockT).toHaveBeenCalledWith('commands.embedWordCloudInDocument');

    const command = getRegisteredCommand(plugin, 'embed-word-cloud-in-document');
    command.callback?.();

    expect(mockedEmbedWordCloudModal).toHaveBeenCalledTimes(1);
    expect(mockModalOpenSpy).toHaveBeenCalledTimes(1);
    expect(mockModalConstructorSpy).toHaveBeenCalledWith(plugin.app, deps.services.wordCloud, expect.any(Function));

    const onSubmit = mockModalConstructorSpy.mock.calls[0]?.[2] as ((embedBlock: string) => void) | undefined;
    onSubmit?.('```wordcloud```');
    expect(mockedInsertEmbedAtCursor).toHaveBeenCalledWith(plugin.app, '```wordcloud```', true);
  });

  test('registers one command total', () => {
    const plugin = createPluginMock();
    const deps = createDepsMock();

    registerCommands(plugin, deps);

    expect(plugin.addCommand).toHaveBeenCalledTimes(1);
  });
});

type RegisteredCommand = { id: string; callback?: () => void };

function getRegisteredCommand(plugin: Plugin & { addCommand: jest.Mock }, id: string): RegisteredCommand {
  const command = plugin.addCommand.mock.calls
    .map((call) => call[0] as RegisteredCommand)
    .find((registeredCommand) => registeredCommand.id === id);

  if (!command) {
    throw new Error(`Command was not registered: ${id}`);
  }

  return command;
}

function createPluginMock(): Plugin & { addCommand: jest.Mock } {
  return {
    app: { workspace: {} },
    addCommand: jest.fn(),
  } as unknown as Plugin & { addCommand: jest.Mock };
}

function createDepsMock(): Deps {
  return {
    settingsService: {
      getSnapshot: jest.fn(() => ({
        openEditorOnInsert: true,
        defaultScopeOnInsert: 'vault',
      })),
    },
    services: {
      obsidian: {},
      wordCloud: { some: 'service' },
    },
    coordinator: {},
    dispose: jest.fn(),
  } as unknown as Deps;
}
