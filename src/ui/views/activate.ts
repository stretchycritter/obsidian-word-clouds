import type { App } from 'obsidian';
import { VIEW_TYPE_NOTE_WORD_CLOUD, VIEW_TYPE_VAULT_WORD_CLOUD } from '@/constants';

export async function activateVaultWordCloudView(app: App): Promise<void> {
  const { workspace } = app;
  const existingLeaf = workspace.getLeavesOfType(VIEW_TYPE_VAULT_WORD_CLOUD)[0];
  const leaf = existingLeaf ?? workspace.getLeaf(true);

  await leaf.setViewState({
    type: VIEW_TYPE_VAULT_WORD_CLOUD,
    active: true,
  });

  workspace.revealLeaf(leaf);
}

export async function activateNoteWordCloudView(app: App): Promise<void> {
  const { workspace } = app;
  const existingLeaf = workspace.getLeavesOfType(VIEW_TYPE_NOTE_WORD_CLOUD)[0];
  const leaf = existingLeaf ?? workspace.getRightLeaf(false);
  if (!leaf) {
    return;
  }

  await leaf.setViewState({
    type: VIEW_TYPE_NOTE_WORD_CLOUD,
    active: true,
  });

  workspace.revealLeaf(leaf);
}
