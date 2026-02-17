import type { Plugin } from 'obsidian';
import { registerEmbeddedWordCloudProcessor } from '../blocks/wordcloud-block';
import { VIEW_TYPE_NOTE_WORD_CLOUD, VIEW_TYPE_VAULT_WORD_CLOUD } from '../constants';
import type { Deps } from '../deps';
import { VaultWordCloudView } from './document-word-cloud-view';
import { NoteWordCloudView } from './sidebar-word-cloud-view';

export function registerViews(plugin: Plugin, deps: Deps): void {
  plugin.registerView(VIEW_TYPE_VAULT_WORD_CLOUD, (leaf) => new VaultWordCloudView(leaf, deps.services.wordCloud));
  plugin.registerView(VIEW_TYPE_NOTE_WORD_CLOUD, (leaf) => new NoteWordCloudView(leaf, deps.services.wordCloud));
  registerEmbeddedWordCloudProcessor(plugin, deps.services.wordCloud);
}
