import type { EventCoordinator } from './events/coordinator';
import type { ObsidianService } from './services/obsidian-service';
import type { SettingsService } from './settings/settings-service';
import type { WordCloudAppService } from './services/wordcloud-services';

export type Deps = {
  settingsService: SettingsService;
  services: {
    obsidian: ObsidianService;
    wordCloud: WordCloudAppService;
  };
  coordinator: EventCoordinator;
  dispose: () => void;
};
