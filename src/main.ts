import { Plugin } from 'obsidian';
import { registerCommands } from './commands/register';
import { createDeps } from './create-deps';
import type { Deps } from './deps';
import { registerEvents } from './events/register';
import { Disposer } from './lifecycle/disposer';
import { registerSettings } from './settings/register';
import { registerUI } from './ui/register';
import { registerViews } from './views/register';

export default class VaultWordCloudPlugin extends Plugin {
  private deps: Deps | null = null;
  private readonly disposer = new Disposer();

  async onload(): Promise<void> {
    try {
      const deps = await this.initializeDependencies();
      this.registerIntegrationPoints(deps);
      this.registerTeardown(deps);
    } catch (error) {
      this.disposer.disposeAll();
      this.deps = null;
      throw error;
    }
  }

  onunload(): void {
    this.disposer.disposeAll();
    this.deps = null;
  }

  private async initializeDependencies(): Promise<Deps> {
    const deps = await createDeps(this);
    this.deps = deps;
    return deps;
  }

  private registerIntegrationPoints(deps: Deps): void {
    registerViews(this, deps);
    registerCommands(this, deps);
    registerEvents(this, deps);
    registerUI(this);
    registerSettings(this, deps);
  }

  private registerTeardown(deps: Deps): void {
    this.disposer.add(deps.dispose);
  }
}
