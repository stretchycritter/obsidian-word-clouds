import type { Plugin } from 'obsidian';
import type { Deps } from '@/types';
import { t } from '@/i18n';
import { EmbedWordCloudModal } from '@/ui';
import { insertEmbedAtCursor } from '@/services/note-service';

export function registerCommands(plugin: Plugin, deps: Deps): void {
  // Future planned features for dedicated views
  // plugin.addCommand({
  //   id: 'open-vault-word-cloud-view',
  //   name: t('commands.openVaultWordCloud'),
  //   callback: () => {
  //     void activateVaultWordCloudView(plugin.app);
  //   },
  // });

  // plugin.addCommand({
  //   id: 'open-note-word-cloud-sidebar',
  //   name: t('commands.openCurrentNoteWordCloud'),
  //   callback: () => {
  //     void activateNoteWordCloudView(plugin.app);
  //   },
  // });

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
