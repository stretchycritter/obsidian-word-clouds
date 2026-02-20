import type { Plugin } from 'obsidian';
import type { Deps } from '@/types';
import { t } from '@/i18n';
import { EmbedWordCloudModal } from '@/ui';
import { insertEmbedAtCursor } from '@/services/note-service';

function buildDefaultEmbedBlock(scope: string): string {
  const cloudId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `wc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  const data: Record<string, string> = {
    scope,
    size: 'medium',
  };

  const dataEncoded = btoa(JSON.stringify(data));
  return `\`\`\`wordcloud\nid: ${cloudId}\ndata: ${dataEncoded}\n\`\`\``;
}

export function registerCommands(plugin: Plugin, deps: Deps): void {
  // FUTURE: Future planned features for dedicated views
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
      const { openEditorOnInsert, defaultScopeOnInsert } = deps.settingsService.getSnapshot();
      if (!openEditorOnInsert) {
        insertEmbedAtCursor(plugin.app, buildDefaultEmbedBlock(defaultScopeOnInsert), true);
        return;
      }

      new EmbedWordCloudModal(
        plugin.app,
        deps.services.wordCloud,
        (embedBlock) => insertEmbedAtCursor(plugin.app, embedBlock, true),
        { mode: 'create' },
      ).open();
    },
  });
}
