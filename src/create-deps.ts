import type { Plugin } from 'obsidian';
import type { Deps } from './deps';
import { EventCoordinator } from './events/coordinator';
import { ObsidianService } from './services/obsidian-service';
import { SettingsService } from './settings/service';
import { WordCloudAppService } from './services/wordcloud-services';
import { WordCloudService } from './wordcloud/application/wordcloud-service';

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
