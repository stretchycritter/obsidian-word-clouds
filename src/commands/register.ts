import type { Plugin } from 'obsidian';
import type { Deps } from '@/types';
import { t } from '@/i18n';
import { EmbedWordCloudModal } from '@/ui';
import { insertEmbedAtCursor } from '@/services/note-service';
import { generateCloudId } from '@/utils/cloud-id';

function buildDefaultEmbedBlock(scope: string): string {
  const cloudId = generateCloudId();

  const data: Record<string, string> = {
    scope,
    size: 'medium',
  };

  const dataEncoded = btoa(JSON.stringify(data));
  return `\`\`\`wordcloud\nid: ${cloudId}\ndata: ${dataEncoded}\n\`\`\``;
}

export function registerCommands(plugin: Plugin, deps: Deps): void {
  // These view commands are implemented but intentionally disabled in v0.2.0.
  // The views (VaultWordCloudView, NoteWordCloudView) are fully registered
  // but accessible only programmatically. Enable these commands in a future release
  // when the sidebar UI is ready for general use.
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
        // insertEmbedAtCursor returns false and shows a Notice when no active
        // markdown editor is open; the return value is captured here so the
        // no-editor path is explicitly acknowledged at the call site.
        const inserted = insertEmbedAtCursor(plugin.app, buildDefaultEmbedBlock(defaultScopeOnInsert), true);
        if (!inserted) {
          return;
        }
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
