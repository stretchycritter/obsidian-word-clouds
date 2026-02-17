import type { Plugin } from 'obsidian';
import { activateVaultWordCloudView } from '../views/activate';

export function registerUI(plugin: Plugin): void {
  plugin.addRibbonIcon('cloud', 'Open word clouds', () => {
    void activateVaultWordCloudView(plugin.app);
  });
}
