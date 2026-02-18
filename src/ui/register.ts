import type { Plugin } from 'obsidian';
import { VIEW_TYPE_NOTE_WORD_CLOUD, VIEW_TYPE_VAULT_WORD_CLOUD } from '@/ui/constants';
import type { Deps } from '@/types';
import { t } from '@/i18n';
import { registerEmbeddedWordCloudProcessor } from '@/ui/blocks/wordcloud-block';
import { activateVaultWordCloudView } from '@/ui/views/activate';
import { VaultWordCloudView } from '@/ui/views/document-word-cloud-view';
import { NoteWordCloudView } from '@/ui/views/sidebar-word-cloud-view';

export function registerUI(plugin: Plugin, deps: Deps): void {
  plugin.registerView(VIEW_TYPE_VAULT_WORD_CLOUD, (leaf) => new VaultWordCloudView(leaf, deps.services.wordCloud));
  plugin.registerView(VIEW_TYPE_NOTE_WORD_CLOUD, (leaf) => new NoteWordCloudView(leaf, deps.services.wordCloud));
  registerEmbeddedWordCloudProcessor(plugin, deps.services.wordCloud);

  plugin.addRibbonIcon('cloud', t('ui.ribbon.openWordClouds'), () => {
    void activateVaultWordCloudView(plugin.app);
  });
}
