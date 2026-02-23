import { AbstractInputSuggest, type App, type TAbstractFile, TFile, TFolder } from 'obsidian';

/**
 * Autocomplete suggest for markdown file paths.
 * Attaches to a text input and shows matching file paths as the user types.
 */
export class FileSuggest extends AbstractInputSuggest<TFile> {
  private readonly inputEl: HTMLInputElement;
  private readonly onPick: (path: string) => void;

  constructor(app: App, inputEl: HTMLInputElement, onPick: (path: string) => void) {
    super(app, inputEl);
    this.inputEl = inputEl;
    this.onPick = onPick;
  }

  getSuggestions(query: string): TFile[] {
    const lowerQuery = query.toLowerCase().trim();
    const files = this.app.vault.getMarkdownFiles();
    if (!lowerQuery) return files.sort((a, b) => a.path.localeCompare(b.path));
    return files
      .filter((file) => file.path.toLowerCase().includes(lowerQuery))
      .sort((a, b) => a.path.localeCompare(b.path));
  }

  renderSuggestion(file: TFile, el: HTMLElement): void {
    el.setText(file.path);
  }

  selectSuggestion(file: TFile): void {
    this.inputEl.value = file.path;
    this.inputEl.dispatchEvent(new Event('input'));
    this.onPick(file.path);
    this.close();
  }
}

/**
 * Autocomplete suggest for folder paths.
 * Attaches to a text input and shows matching folder paths as the user types.
 */
export class FolderSuggest extends AbstractInputSuggest<TFolder> {
  private readonly inputEl: HTMLInputElement;
  private readonly onPick: (path: string) => void;

  constructor(app: App, inputEl: HTMLInputElement, onPick: (path: string) => void) {
    super(app, inputEl);
    this.inputEl = inputEl;
    this.onPick = onPick;
  }

  getSuggestions(query: string): TFolder[] {
    const lowerQuery = query.toLowerCase().trim();
    const folders: TFolder[] = [];
    this.app.vault.getAllLoadedFiles().forEach((file: TAbstractFile) => {
      if (file instanceof TFolder && file.path !== '/') {
        folders.push(file);
      }
    });
    folders.sort((a, b) => a.path.localeCompare(b.path));
    if (!lowerQuery) return folders;
    return folders.filter((folder) => folder.path.toLowerCase().includes(lowerQuery));
  }

  renderSuggestion(folder: TFolder, el: HTMLElement): void {
    el.setText(folder.path);
  }

  selectSuggestion(folder: TFolder): void {
    this.inputEl.value = folder.path;
    this.inputEl.dispatchEvent(new Event('input'));
    this.onPick(folder.path);
    this.close();
  }
}
