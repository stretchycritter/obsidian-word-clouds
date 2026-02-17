import type { Plugin } from 'obsidian';
import { t } from '../i18n';
import { activateVaultWordCloudView } from '../views/activate';

export function registerUI(plugin: Plugin): void {
  plugin.addRibbonIcon('cloud', t('ui.ribbon.openWordClouds'), () => {
    void activateVaultWordCloudView(plugin.app);
  });
}
