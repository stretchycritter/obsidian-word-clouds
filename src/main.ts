import { Plugin } from 'obsidian';
import { registerCommands } from '@/commands/register';
import type { Deps } from '@/types';
import { registerEvents } from '@/events/register';
import { initI18n } from '@/i18n';
import { Disposer } from '@/disposer';
import { registerSettings } from '@/settings/register';
import { registerUI } from '@/ui';
import { EventCoordinator } from '@/events/coordinator';
import { ObsidianService } from '@/services/obsidian-service';
import { SettingsService } from '@/settings/settings-service';
import { WordCloudAppService } from '@/services/wordcloud-services';
import { WordCloudService } from '@/core';

export default class VaultWordCloudPlugin extends Plugin {
  private readonly disposer = new Disposer();

  async onload(): Promise<void> {
    try {
      initI18n();
      const deps = await this.initializeDependencies();
      this.registerTeardown(deps);
      this.registerIntegrationPoints(deps);
    } catch (error) {
      this.disposer.disposeAll();
      throw error;
    }
  }

  onunload(): void {
    this.disposer.disposeAll();
  }

  private async initializeDependencies(): Promise<Deps> {
    return createDeps(this);
  }

  private registerIntegrationPoints(deps: Deps): void {
    registerCommands(this, deps);
    registerEvents(this, deps);
    registerUI(this, deps);
    registerSettings(this, deps);
  }

  private registerTeardown(deps: Deps): void {
    this.disposer.add(deps.dispose);
  }
}

export async function createDeps(plugin: Plugin): Promise<Deps> {
  const settingsService = new SettingsService(plugin);
  await settingsService.load();

  const obsidian = new ObsidianService(plugin.app);
  const processor = new WordCloudService(plugin.app);
  const wordCloud = new WordCloudAppService(plugin.app, obsidian, processor, settingsService);
  const coordinator = new EventCoordinator();

  return {
    settingsService,
    services: {
      obsidian,
      wordCloud,
    },
    coordinator,
    dispose: () => {
      coordinator.dispose();
      settingsService.dispose();
    },
  };
}
