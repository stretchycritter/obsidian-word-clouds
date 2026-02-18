import type { Plugin } from 'obsidian';
import type { Deps } from '@/types';
import { VaultWordCloudSettingTab } from '@/settings/tab';

export function registerSettings(plugin: Plugin, deps: Deps): void {
  plugin.addSettingTab(new VaultWordCloudSettingTab(plugin, deps.services.wordCloud));
}
