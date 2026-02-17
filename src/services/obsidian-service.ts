import { MarkdownView, type App, TFile, TFolder } from 'obsidian';

export class ObsidianService {
  constructor(private readonly app: App) {}

  getAvailableFolders(): string[] {
    return this.app.vault
      .getAllLoadedFiles()
      .filter((file): file is TFolder => file instanceof TFolder)
      .map((folder) => folder.path)
      .sort((a, b) => a.localeCompare(b));
  }

  getOpenMarkdownFiles(): TFile[] {
    const files = new Map<string, TFile>();

    for (const leaf of this.app.workspace.getLeavesOfType('markdown')) {
      const view = leaf.view;
      if (view instanceof MarkdownView && view.file) {
        files.set(view.file.path, view.file);
      }
    }

    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
      files.set(activeFile.path, activeFile);
    }

    return [...files.values()].sort((a, b) => a.path.localeCompare(b.path));
  }

  getActiveFile(): TFile | null {
    return this.app.workspace.getActiveFile();
  }

  getMarkdownFiles(): TFile[] {
    return this.app.vault.getMarkdownFiles();
  }
}
