import type { EventCoordinator } from './events/coordinator';
import type { ObsidianAdapter } from './integration/obsidian-adapter';
import type { SettingsService } from './settings/service';
import type { WordCloudAppService } from './services/wordcloud-services';

export type Deps = {
  settingsService: SettingsService;
  adapter: ObsidianAdapter;
  services: {
    wordCloud: WordCloudAppService;
  };
  coordinator: EventCoordinator;
  dispose: () => void;
};
