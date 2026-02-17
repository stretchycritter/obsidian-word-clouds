import type { Plugin } from 'obsidian';
import type { Deps } from '../deps';
import { t } from '../i18n';
import { EmbedWordCloudModal } from '../modals/edit-word-cloud-modal';
import { insertEmbedAtCursor } from '../services/editor-insertion';
import { activateNoteWordCloudView, activateVaultWordCloudView } from '../views/activate';

export function registerCommands(plugin: Plugin, deps: Deps): void {
  plugin.addCommand({
    id: 'open-vault-word-cloud-view',
    name: t('commands.openVaultWordCloud'),
    callback: () => {
      void activateVaultWordCloudView(plugin.app);
    },
  });

  plugin.addCommand({
    id: 'open-note-word-cloud-sidebar',
    name: t('commands.openCurrentNoteWordCloud'),
    callback: () => {
      void activateNoteWordCloudView(plugin.app);
    },
  });

  plugin.addCommand({
    id: 'embed-word-cloud-in-document',
    name: t('commands.embedWordCloudInDocument'),
    callback: () => {
      new EmbedWordCloudModal(
        plugin.app,
        deps.services.wordCloud,
        (embedBlock) => insertEmbedAtCursor(plugin.app, embedBlock),
      ).open();
    },
  });
}
