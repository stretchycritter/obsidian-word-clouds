import { App, ButtonComponent, Modal, Notice, Setting, type TFile } from 'obsidian';
import type { TagMatchMode, WordCloudServices } from '../types';

type EmbedMode = 'current-file' | 'specific-file' | 'tag-based';

type EmbedWizardState = {
  mode: EmbedMode;
  filePath: string;
  tagsRaw: string;
  match: TagMatchMode;
  height: number;
  interactions: boolean;
};

const DEFAULT_STATE: EmbedWizardState = {
  mode: 'current-file',
  filePath: '',
  tagsRaw: '',
  match: 'any',
  height: 320,
  interactions: true,
};

export class EmbedWordCloudModal extends Modal {
  private readonly services: WordCloudServices;
  private readonly onInsert: (embedBlock: string) => boolean;
  private readonly state: EmbedWizardState;

  private modeWrapperEl!: HTMLDivElement;
  private fileWrapperEl!: HTMLDivElement;
  private tagsWrapperEl!: HTMLDivElement;
  private matchWrapperEl!: HTMLDivElement;

  constructor(app: App, services: WordCloudServices, onInsert: (embedBlock: string) => boolean) {
    super(app);
    this.services = services;
    this.onInsert = onInsert;

    const activeFile = this.services.getActiveFile();
    this.state = {
      ...DEFAULT_STATE,
      filePath: activeFile?.path ?? '',
    };
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('word-cloud-embed-wizard');

    contentEl.createEl('h2', { text: 'Embed word cloud in document' });
    contentEl.createEl('p', {
      cls: 'word-cloud-embed-wizard-description',
      text: 'Configure options, then insert a word cloud embed at your cursor.',
    });

    this.modeWrapperEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });
    this.fileWrapperEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });
    this.tagsWrapperEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });
    this.matchWrapperEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });

    new Setting(this.modeWrapperEl)
      .setName('Source')
      .setDesc('Choose where this embedded cloud pulls words from.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('current-file', 'Current note')
          .addOption('specific-file', 'Specific note')
          .addOption('tag-based', 'Vault filtered by tags')
          .setValue(this.state.mode)
          .onChange((value) => {
            this.state.mode = value === 'specific-file' || value === 'tag-based' ? value : 'current-file';
            this.refreshConditionalSections();
          });
      });

    this.renderFileSetting();
    this.renderTagSetting();
    this.renderMatchSetting();

    new Setting(contentEl)
      .setName('Height')
      .setDesc('Height of the embedded cloud in pixels.')
      .addSlider((slider) => {
        slider
          .setLimits(180, 900, 10)
          .setValue(this.state.height)
          .setDynamicTooltip()
          .onChange((value) => {
            this.state.height = value;
          });
      });

    new Setting(contentEl)
      .setName('Enable interactions')
      .setDesc('Allow zoom, pan, and click-to-search interactions.')
      .addToggle((toggle) => {
        toggle
          .setValue(this.state.interactions)
          .onChange((value) => {
            this.state.interactions = value;
          });
      });

    const buttonRowEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-actions' });

    const cancelButton = new ButtonComponent(buttonRowEl)
      .setButtonText('Cancel')
      .onClick(() => {
        this.close();
      });
    cancelButton.buttonEl.type = 'button';

    const insertButton = new ButtonComponent(buttonRowEl)
      .setButtonText('Insert')
      .setCta()
      .onClick(() => {
        if (this.state.mode === 'specific-file' && !this.state.filePath) {
          new Notice('Select an open markdown note before inserting.');
          return;
        }

        const wasInserted = this.onInsert(this.buildEmbedBlock());
        if (wasInserted) {
          this.close();
        }
      });
    insertButton.buttonEl.type = 'button';

    this.refreshConditionalSections();
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private renderFileSetting(): void {
    this.fileWrapperEl.empty();

    new Setting(this.fileWrapperEl)
      .setName('Specific note')
      .setDesc('Use one open note as the source for this embedded cloud.')
      .addDropdown((dropdown) => {
        const openFiles = this.services.getOpenMarkdownFiles();
        const selectedPath = this.resolveSelectedPath(openFiles, this.state.filePath);

        for (const file of openFiles) {
          dropdown.addOption(file.path, file.path);
        }

        if (openFiles.length === 0) {
          dropdown.addOption('', 'No open markdown notes');
          dropdown.setDisabled(true);
          this.state.filePath = '';
          return;
        }

        this.state.filePath = selectedPath;
        dropdown
          .setValue(selectedPath)
          .onChange((value) => {
            this.state.filePath = value;
          });
      });
  }

  private renderTagSetting(): void {
    this.tagsWrapperEl.empty();

    const availableTags = this.services.getAvailableTags();
    const tagHint = availableTags.length > 0
      ? `Available: ${availableTags.slice(0, 12).join(', ')}${availableTags.length > 12 ? '…' : ''}`
      : 'No tags detected yet.';

    new Setting(this.tagsWrapperEl)
      .setName('Tags')
      .setDesc(`Optional comma-separated tags. ${tagHint}`)
      .addText((text) => {
        text
          .setPlaceholder('#project, #meeting')
          .setValue(this.state.tagsRaw)
          .onChange((value) => {
            this.state.tagsRaw = value;
          });
      });
  }

  private renderMatchSetting(): void {
    this.matchWrapperEl.empty();

    new Setting(this.matchWrapperEl)
      .setName('Tag match mode')
      .setDesc('When multiple tags are set, match any or all of them.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('any', 'Any tag')
          .addOption('all', 'All tags')
          .setValue(this.state.match)
          .onChange((value) => {
            this.state.match = value === 'all' ? 'all' : 'any';
          });
      });
  }

  private resolveSelectedPath(files: TFile[], preferredPath: string): string {
    if (preferredPath && files.some((file) => file.path === preferredPath)) {
      return preferredPath;
    }

    const activeFile = this.services.getActiveFile();
    if (activeFile && files.some((file) => file.path === activeFile.path)) {
      return activeFile.path;
    }

    return files[0]?.path ?? '';
  }

  private refreshConditionalSections(): void {
    const isSpecific = this.state.mode === 'specific-file';
    const isTagBased = this.state.mode === 'tag-based';

    this.fileWrapperEl.toggleClass('is-hidden', !isSpecific);
    this.tagsWrapperEl.toggleClass('is-hidden', !isTagBased);
    this.matchWrapperEl.toggleClass('is-hidden', !isTagBased);
  }

  private buildEmbedBlock(): string {
    const lines = ['```wordcloud', `mode: ${this.state.mode}`];

    if (this.state.mode === 'specific-file' && this.state.filePath) {
      lines.push(`file: ${this.state.filePath}`);
    }

    if (this.state.mode === 'tag-based') {
      const normalizedTags = this.state.tagsRaw
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      if (normalizedTags.length > 0) {
        lines.push(`tags: ${normalizedTags.join(', ')}`);
      }
      lines.push(`match: ${this.state.match}`);
    }

    lines.push(`height: ${this.state.height}`);
    lines.push(`interactions: ${this.state.interactions ? 'true' : 'false'}`);
    lines.push('```');

    return lines.join('\n');
  }
}
