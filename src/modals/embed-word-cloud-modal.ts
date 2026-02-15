import { App, ButtonComponent, Modal, Notice, Setting } from 'obsidian';
import type { WordCloudServices } from '../types';

export type EmbedScope = 'file' | 'vault';
export type EmbedSize = 'small' | 'medium' | 'large';

export type EmbedWizardState = {
  scope: EmbedScope;
  size: EmbedSize;
  tagsRaw: string;
};

type EmbedWordCloudModalOptions = {
  title?: string;
  description?: string;
  submitButtonText?: string;
  initialState?: Partial<EmbedWizardState>;
};

const DEFAULT_STATE: EmbedWizardState = {
  scope: 'file',
  size: 'medium',
  tagsRaw: '',
};

export class EmbedWordCloudModal extends Modal {
  private readonly services: WordCloudServices;
  private readonly onInsert: (embedBlock: string) => boolean | Promise<boolean>;
  private readonly state: EmbedWizardState;
  private readonly title: string;
  private readonly description: string;
  private readonly submitButtonText: string;

  private scopeWrapperEl!: HTMLDivElement;
  private sizeWrapperEl!: HTMLDivElement;
  private tagsWrapperEl!: HTMLDivElement;

  constructor(
    app: App,
    services: WordCloudServices,
    onInsert: (embedBlock: string) => boolean | Promise<boolean>,
    options: EmbedWordCloudModalOptions = {},
  ) {
    super(app);
    this.services = services;
    this.onInsert = onInsert;
    this.title = options.title ?? 'Embed word cloud in document';
    this.description = options.description ?? 'Configure options, then insert a word cloud embed at your cursor.';
    this.submitButtonText = options.submitButtonText ?? 'Insert';

    const initialState = options.initialState ?? {};
    this.state = {
      ...DEFAULT_STATE,
      ...initialState,
    };
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('word-cloud-embed-wizard');

    contentEl.createEl('h2', { text: this.title });
    contentEl.createEl('p', {
      cls: 'word-cloud-embed-wizard-description',
      text: this.description,
    });

    this.scopeWrapperEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });
    this.sizeWrapperEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });
    this.tagsWrapperEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-section' });

    new Setting(this.scopeWrapperEl)
      .setName('Scope')
      .setDesc('Choose whether this cloud uses the current file or the entire vault.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('file', 'File')
          .addOption('vault', 'Vault')
          .setValue(this.state.scope)
          .onChange((value) => {
            this.state.scope = value === 'vault' ? 'vault' : 'file';
            this.refreshConditionalSections();
          });
      });

    new Setting(this.sizeWrapperEl)
      .setName('Size')
      .setDesc('Select the embedded cloud size preset.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('small', 'Small')
          .addOption('medium', 'Medium')
          .addOption('large', 'Large')
          .setValue(this.state.size)
          .onChange((value) => {
            this.state.size = value === 'small' || value === 'large' ? value : 'medium';
          });
      });

    this.renderTagSetting();

    const buttonRowEl = contentEl.createDiv({ cls: 'word-cloud-embed-wizard-actions' });

    const cancelButton = new ButtonComponent(buttonRowEl)
      .setButtonText('Cancel')
      .onClick(() => {
        this.close();
      });
    cancelButton.buttonEl.type = 'button';

    const insertButton = new ButtonComponent(buttonRowEl)
      .setButtonText(this.submitButtonText)
      .setCta()
      .onClick(async () => {
        insertButton.setDisabled(true);
        try {
          const wasInserted = await this.onInsert(this.buildEmbedBlock());
          if (wasInserted && this.isOpen) {
            this.close();
          }
        } catch (error) {
          console.error('Word clouds: failed to apply embed changes', error);
          new Notice('Could not apply word cloud changes.');
        }
        if (insertButton.buttonEl.isConnected) {
          insertButton.setDisabled(false);
        }
      });
    insertButton.buttonEl.type = 'button';

    this.refreshConditionalSections();
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private renderTagSetting(): void {
    this.tagsWrapperEl.empty();

    const availableTags = this.services.getAvailableTags();
    const tagHint = availableTags.length > 0
      ? `Available: ${availableTags.slice(0, 12).join(', ')}${availableTags.length > 12 ? '…' : ''}`
      : 'No tags detected yet.';

    new Setting(this.tagsWrapperEl)
      .setName('Tag filter include list')
      .setDesc(`Optional comma-separated tags to include. ${tagHint}`)
      .addText((text) => {
        text
          .setPlaceholder('#project, #meeting')
          .setValue(this.state.tagsRaw)
          .onChange((value) => {
            this.state.tagsRaw = value;
          });
      });
  }

  private refreshConditionalSections(): void {
    this.tagsWrapperEl.toggleClass('is-hidden', this.state.scope !== 'vault');
  }

  private buildEmbedBlock(): string {
    const lines = ['```wordcloud', `scope: ${this.state.scope}`, `size: ${this.state.size}`];

    if (this.state.scope === 'vault') {
      const normalizedTags = this.state.tagsRaw
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      if (normalizedTags.length > 0) {
        lines.push(`tags: ${normalizedTags.join(', ')}`);
      }
    }

    lines.push('```');

    return lines.join('\n');
  }
}
