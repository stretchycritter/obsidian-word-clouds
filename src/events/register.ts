import type { Plugin } from 'obsidian';
import type { Deps } from '@/types';

/**
 * registerEvents is intentional scaffolding for future workspace and vault event wiring.
 * Handlers for events such as `vault.on('modify', ...)` or `workspace.on('active-leaf-change', ...)`
 * should be added inside this function. Each handler should be registered via
 * `_plugin.registerEvent(...)` so that Obsidian automatically removes it on plugin unload.
 *
 * The function intentionally receives `_deps` so that services (e.g. the word cloud service
 * or settings service) are available to event handlers without additional plumbing when the
 * time comes to implement them.
 */
export function registerEvents(_plugin: Plugin, _deps: Deps): void {
  // Workspace/vault event registrations belong here.
}
