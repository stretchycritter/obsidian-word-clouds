import { Plugin } from 'obsidian';
import { registerCommands } from '@/commands/register';
import { createDeps } from '@/create-deps';
import type { Deps } from '@/deps';
import { registerEvents } from '@/events/register';
import { initI18n } from '@/i18n';
import { Disposer } from '@/lifecycle/disposer';
import { registerSettings } from '@/settings/register';
import { registerUI } from '@/ui/register';

export default class VaultWordCloudPlugin extends Plugin {
  private readonly disposer = new Disposer();

  async onload(): Promise<void> {
    try {
      initI18n();
      const deps = await this.initializeDependencies();
      this.registerIntegrationPoints(deps);
      this.registerTeardown(deps);
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
