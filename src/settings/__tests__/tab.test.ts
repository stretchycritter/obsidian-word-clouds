import type { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS } from '@/settings/constants';

jest.mock('obsidian', () => {
  type EventHandler = (event: any) => void | Promise<void>;

  class MockElement {
    tagName: string;
    text = '';
    classNames = new Set<string>();
    attributes = new Map<string, string>();
    children: MockElement[] = [];
    listeners = new Map<string, EventHandler[]>();
    open = false;
    type = '';
    removed = false;

    constructor(tagName: string, opts?: { cls?: string; text?: string }) {
      this.tagName = tagName;
      if (opts?.text) {
        this.text = opts.text;
      }
      if (opts?.cls) {
        for (const className of opts.cls.split(/\s+/).filter(Boolean)) {
          this.classNames.add(className);
        }
      }
    }

    empty(): void {
      this.children = [];
    }

    createEl(tagName: string, opts?: { cls?: string; text?: string }): MockElement {
      const child = new MockElement(tagName, opts);
      this.children.push(child);
      return child;
    }

    createDiv(opts?: { cls?: string; text?: string }): MockElement {
      return this.createEl('div', opts);
    }

    createSpan(opts?: { cls?: string; text?: string }): MockElement {
      return this.createEl('span', opts);
    }

    setText(text: string): void {
      this.text = text;
    }

    setAttr(name: string, value: string): void {
      this.attributes.set(name, value);
    }

    addEventListener(eventName: string, handler: EventHandler): void {
      const handlers = this.listeners.get(eventName) ?? [];
      handlers.push(handler);
      this.listeners.set(eventName, handlers);
    }

    async trigger(eventName: string, event: any = {}): Promise<void> {
      const handlers = this.listeners.get(eventName) ?? [];
      for (const handler of handlers) {
        await handler(event);
      }
    }

    remove(): void {
      this.removed = true;
    }

    addClass(className: string): void {
      this.classNames.add(className);
    }

    removeClass(className: string): void {
      this.classNames.delete(className);
    }

    toggleClass(className: string, value: boolean): void {
      if (value) {
        this.classNames.add(className);
      } else {
        this.classNames.delete(className);
      }
    }

    hasClass(className: string): boolean {
      return this.classNames.has(className);
    }

    appendChild(child: MockElement): void {
      const idx = this.children.indexOf(child);
      if (idx !== -1) {
        this.children.splice(idx, 1);
      }
      this.children.push(child);
    }

    findByClass(className: string): MockElement | null {
      if (this.classNames.has(className)) {
        return this;
      }
      for (const child of this.children) {
        const match = child.findByClass(className);
        if (match) {
          return match;
        }
      }
      return null;
    }
  }

  class MockPluginSettingTab {
    app: unknown;
    plugin: unknown;
    containerEl: MockElement;

    constructor(app: unknown, plugin: unknown) {
      this.app = app;
      this.plugin = plugin;
      this.containerEl = new MockElement('div');
    }
  }

  class MockDropdownControl {
    disabled = false;
    value = '';
    private changeHandler?: (value: string) => void | Promise<void>;

    addOption(_value: string, _label: string): this {
      return this;
    }

    setValue(value: string): this {
      this.value = value;
      return this;
    }

    setDisabled(disabled: boolean): this {
      this.disabled = disabled;
      return this;
    }

    onChange(handler: (value: string) => void | Promise<void>): this {
      this.changeHandler = handler;
      return this;
    }

    async triggerChange(value: string): Promise<void> {
      if (this.changeHandler) {
        await this.changeHandler(value);
      }
    }
  }

  class MockSliderControl {
    disabled = false;
    value = 0;
    private changeHandler?: (value: number) => void | Promise<void>;

    setLimits(_min: number, _max: number, _step: number): this {
      return this;
    }

    setValue(value: number): this {
      this.value = value;
      return this;
    }

    setDynamicTooltip(): this {
      return this;
    }

    setDisabled(disabled: boolean): this {
      this.disabled = disabled;
      return this;
    }

    onChange(handler: (value: number) => void | Promise<void>): this {
      this.changeHandler = handler;
      return this;
    }

    async triggerChange(value: number): Promise<void> {
      if (this.changeHandler) {
        await this.changeHandler(value);
      }
    }
  }

  class MockToggleControl {
    disabled = false;
    value = false;
    private changeHandler?: (value: boolean) => void | Promise<void>;

    setValue(value: boolean): this {
      this.value = value;
      return this;
    }

    setDisabled(disabled: boolean): this {
      this.disabled = disabled;
      return this;
    }

    onChange(handler: (value: boolean) => void | Promise<void>): this {
      this.changeHandler = handler;
      return this;
    }

    async triggerChange(value: boolean): Promise<void> {
      if (this.changeHandler) {
        await this.changeHandler(value);
      }
    }
  }

  class MockButtonControl {
    private clickHandler?: () => void | Promise<void>;

    setButtonText(_text: string): this {
      return this;
    }

    setCta(): this {
      return this;
    }

    setWarning(): this {
      return this;
    }

    onClick(handler: () => void | Promise<void>): this {
      this.clickHandler = handler;
      return this;
    }

    async triggerClick(): Promise<void> {
      if (this.clickHandler) {
        await this.clickHandler();
      }
    }
  }

  class MockTextControl {
    value = '';
    placeholder = '';
    inputEl = {
      addEventListener: (eventName: string, handler: EventHandler): void => {
        const handlers = this.listeners.get(eventName) ?? [];
        handlers.push(handler);
        this.listeners.set(eventName, handlers);
      },
    };
    private changeHandler?: (value: string) => void | Promise<void>;
    private listeners = new Map<string, EventHandler[]>();

    setPlaceholder(placeholder: string): this {
      this.placeholder = placeholder;
      return this;
    }

    setValue(value: string): this {
      this.value = value;
      return this;
    }

    onChange(handler: (value: string) => void | Promise<void>): this {
      this.changeHandler = handler;
      return this;
    }

    async triggerInput(value: string): Promise<void> {
      if (this.changeHandler) {
        await this.changeHandler(value);
      }
    }

    async triggerKeydown(key: string): Promise<{ preventDefault: jest.Mock }> {
      const event = { key, preventDefault: jest.fn() };
      const handlers = this.listeners.get('keydown') ?? [];
      for (const handler of handlers) {
        await handler(event);
      }
      return event;
    }
  }

  class MockSetting {
    static instances: MockSetting[] = [];
    name = '';
    controls: unknown[] = [];

    constructor(_containerEl: MockElement) {
      MockSetting.instances.push(this);
    }

    setName(name: string | DocumentFragment): this {
      this.name = typeof name === 'string' ? name : (name.textContent ?? '');
      return this;
    }

    setDesc(_desc: string): this {
      return this;
    }

    setHeading(): this {
      return this;
    }

    addText(callback: (text: MockTextControl) => void): this {
      const control = new MockTextControl();
      callback(control);
      this.controls.push(control);
      return this;
    }

    addButton(callback: (button: MockButtonControl) => void): this {
      const control = new MockButtonControl();
      callback(control);
      this.controls.push(control);
      return this;
    }

    addDropdown(callback: (dropdown: MockDropdownControl) => void): this {
      const control = new MockDropdownControl();
      callback(control);
      this.controls.push(control);
      return this;
    }

    addSlider(callback: (slider: MockSliderControl) => void): this {
      const control = new MockSliderControl();
      callback(control);
      this.controls.push(control);
      return this;
    }

    addToggle(callback: (toggle: MockToggleControl) => void): this {
      const control = new MockToggleControl();
      callback(control);
      this.controls.push(control);
      return this;
    }
  }

  return {
    PluginSettingTab: MockPluginSettingTab,
    Setting: MockSetting,
    setIcon: jest.fn(),
    __mocks: {
      MockSetting,
      MockElement,
    },
  };
}, { virtual: true });

jest.mock('@/core', () => ({
  renderWordCloudCanvas: jest.fn().mockResolvedValue(undefined),
}));

import { renderWordCloudCanvas } from '@/core';
import { VaultWordCloudSettingTab } from '@/settings/tab';

type MockServices = ReturnType<typeof createServicesMock>;

const mockedRenderWordCloudCanvas = renderWordCloudCanvas as jest.MockedFunction<typeof renderWordCloudCanvas>;
const obsidianMock = jest.requireMock('obsidian') as {
  __mocks: {
    MockSetting: {
      instances: Array<{ name: string; controls: unknown[] }>;
    };
  };
};

describe('VaultWordCloudSettingTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    obsidianMock.__mocks.MockSetting.instances.length = 0;
    (globalThis as { __DEV_BUILD__?: boolean }).__DEV_BUILD__ = true;
    (globalThis as any).window = { confirm: jest.fn(), open: jest.fn() };
    // Minimal document stub for DocumentFragment usage in tab.ts (node test env has no DOM).
    (globalThis as any).document = {
      createDocumentFragment: () => {
        const parts: Array<string | { textContent?: string }> = [];
        return {
          append: (s: string) => { parts.push(s); },
          appendChild: (child: { textContent?: string }) => { parts.push(child); return child; },
          // Evaluated lazily so children mutated after appendChild are captured correctly.
          get textContent() {
            return parts.map((p) => (typeof p === 'string' ? p : (p.textContent ?? ''))).join('');
          },
        };
      },
      createElement: (_tag: string) => ({ className: '', textContent: '' }),
    };
  });

  test('renders preview initially and rerenders after render-default changes', async () => {
    const services = createServicesMock();
    const tab = createTab(services);
    tab.display();

    expect(mockedRenderWordCloudCanvas).toHaveBeenCalledTimes(1);

    const rotationDropdown = getControl('Rotation style', 0) as { triggerChange: (value: string) => Promise<void> };
    await rotationDropdown.triggerChange('vertical');

    expect(services.updateRenderSettings).toHaveBeenCalledWith({ rotationPreset: 'vertical' });
    expect(mockedRenderWordCloudCanvas).toHaveBeenCalledTimes(2);
  });

  test('routes font-range changes through constrained service methods and rerenders preview', async () => {
    const services = createServicesMock();
    const tab = createTab(services);
    tab.display();

    const minSlider = getControl('Font size range', 0) as { triggerChange: (value: number) => Promise<void> };
    const maxSlider = getControl('Font size range', 1) as { triggerChange: (value: number) => Promise<void> };

    await minSlider.triggerChange(20);
    await maxSlider.triggerChange(90);

    expect(services.updateMinimumFontSize).toHaveBeenCalledWith(20);
    expect(services.updateMaximumFontSize).toHaveBeenCalledWith(90);
    expect(mockedRenderWordCloudCanvas.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  test('show-count toggle updates settings and rerenders preview without full tab redraw', async () => {
    const settings = createSettings();
    settings.render.showCountInWordText = false;
    const services = createServicesMock(settings);
    const tab = createTab(services);
    const displaySpy = jest.spyOn(tab, 'display');

    tab.display();

    const showCountToggle = getControl('Show count for words', 0) as {
      triggerChange: (value: boolean) => Promise<void>;
    };
    await showCountToggle.triggerChange(true);

    expect(services.updateRenderSettings).toHaveBeenCalledWith({ showCountInWordText: true });
    expect(mockedRenderWordCloudCanvas).toHaveBeenCalledTimes(2);
    expect(displaySpy).toHaveBeenCalledTimes(1);
  });

  test('disables emphasis slider when scaling mode is not power', () => {
    const settings = createSettings();
    settings.render.scalingMode = 'linear';
    const services = createServicesMock(settings);
    const tab = createTab(services);
    tab.display();

    const emphasisSlider = getControl('Size scaling emphasis', 0) as { disabled: boolean };
    expect(emphasisSlider.disabled).toBe(true);
  });

  test('supports excluded-word add by button and enter, and remove by badge action', async () => {
    const settings = createSettings();
    settings.exclusionListWords = ['alpha'];
    const services = createServicesMock(settings);
    services.addExclusionListWord
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);
    const tab = createTab(services);
    const displaySpy = jest.spyOn(tab, 'display');

    tab.display();

    const textControl = getControl('Add excluded word', 0) as {
      triggerInput: (value: string) => Promise<void>;
      triggerKeydown: (key: string) => Promise<{ preventDefault: jest.Mock }>;
    };
    const addButton = getControl('Add excluded word', 1) as { triggerClick: () => Promise<void> };

    await textControl.triggerInput('beta');
    await addButton.triggerClick();
    expect(services.addExclusionListWord).toHaveBeenCalledWith('beta');

    await textControl.triggerInput('gamma');
    const keyEvent = await textControl.triggerKeydown('Enter');
    expect(keyEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(services.addExclusionListWord).toHaveBeenCalledWith('gamma');

    const removeButton = (tab.containerEl as unknown as {
      findByClass: (className: string) => { trigger: (eventName: string) => Promise<void> } | null;
    }).findByClass('vault-word-cloud-settings-badge-remove');
    expect(removeButton).not.toBeNull();
    await removeButton?.trigger('click');
    expect(services.removeExclusionListWord).toHaveBeenCalledWith('alpha');
    expect(displaySpy).toHaveBeenCalledTimes(4);
  });

  test('reset-all button honors confirmation prompt and only resets when confirmed', async () => {
    const services = createServicesMock();
    const tab = createTab(services);
    const displaySpy = jest.spyOn(tab, 'display');

    tab.display();

    const resetAllButton = getControl('Reset settings to default', 0) as { triggerClick: () => Promise<void> };
    const confirmMock = (globalThis as any).window.confirm as jest.Mock;

    confirmMock.mockReturnValueOnce(false);
    await resetAllButton.triggerClick();
    expect(services.resetAllSettings).not.toHaveBeenCalled();

    confirmMock.mockReturnValueOnce(true);
    await resetAllButton.triggerClick();
    expect(services.resetAllSettings).toHaveBeenCalledTimes(1);
    expect(displaySpy).toHaveBeenCalledTimes(2);
  });

  test('processing speed dropdown updates performance mode and rerenders preview', async () => {
    const services = createServicesMock();
    const tab = createTab(services);
    tab.display();

    const dropdown = getControl('Processing speed', 0) as { triggerChange: (value: string) => Promise<void> };
    await dropdown.triggerChange('throttled');

    expect(services.updateRenderSettings).toHaveBeenCalledWith({ performanceMode: 'throttled' });
    expect(mockedRenderWordCloudCanvas).toHaveBeenCalledTimes(2);
  });

  test('performance benchmark runs whole-vault collection for each performance mode', async () => {
    const services = createServicesMock();
    services.collectVaultWordsWithMetrics
      .mockResolvedValueOnce({
        words: [{ text: 'warmup', count: 5, size: 17 }],
        metrics: { collectionMs: 10 },
      })
      .mockResolvedValueOnce({
        words: [{ text: 'fast', count: 4, size: 16 }],
        metrics: { collectionMs: 11 },
      })
      .mockResolvedValueOnce({
        words: [{ text: 'balanced', count: 3, size: 15 }],
        metrics: { collectionMs: 12 },
      })
      .mockResolvedValueOnce({
        words: [{ text: 'slow', count: 2, size: 14 }],
        metrics: { collectionMs: 13 },
      });
    const tab = createTab(services);
    tab.display();

    const runButton = getControl('Benchmark all performance modes', 0) as { triggerClick: () => Promise<void> };
    await runButton.triggerClick();

    expect(services.collectVaultWordsWithMetrics).toHaveBeenCalledTimes(4);
    expect(services.collectVaultWordsWithMetrics).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        sourceRules: expect.objectContaining({
          scope: expect.objectContaining({ mode: 'vault' }),
        }),
        renderSettingsOverride: expect.objectContaining({ performanceMode: 'balanced' }),
      }),
    );
    expect(services.collectVaultWordsWithMetrics).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        sourceRules: expect.objectContaining({
          scope: expect.objectContaining({ mode: 'vault' }),
        }),
        renderSettingsOverride: expect.objectContaining({ performanceMode: 'full-speed' }),
      }),
    );
    expect(services.collectVaultWordsWithMetrics).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        sourceRules: expect.objectContaining({
          scope: expect.objectContaining({ mode: 'vault' }),
        }),
        renderSettingsOverride: expect.objectContaining({ performanceMode: 'balanced' }),
      }),
    );
    expect(services.collectVaultWordsWithMetrics).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        sourceRules: expect.objectContaining({
          scope: expect.objectContaining({ mode: 'vault' }),
        }),
        renderSettingsOverride: expect.objectContaining({ performanceMode: 'throttled' }),
      }),
    );
  });

  test('minimum word length slider updates filter settings', async () => {
    const services = createServicesMock();
    const tab = createTab(services);
    tab.display();

    const slider = getControl('Minimum word length', 0) as { triggerChange: (value: number) => Promise<void> };
    await slider.triggerChange(7);

    expect(services.updateFilterSettings).toHaveBeenCalledWith({ minWordLength: 7 });
  });

  test('word case mode dropdown updates render settings', async () => {
    const services = createServicesMock();
    const tab = createTab(services);
    tab.display();

    const dropdown = getControl('Word case mode', 0) as { triggerChange: (value: string) => Promise<void> };
    await dropdown.triggerChange('normalized');

    expect(services.updateRenderSettings).toHaveBeenCalledWith({ wordCaseMode: 'normalized' });
  });

  test('click to search toggle updates render settings', async () => {
    const services = createServicesMock();
    const tab = createTab(services);
    tab.display();

    const toggle = getControl('Click to search', 0) as { triggerChange: (value: boolean) => Promise<void> };
    await toggle.triggerChange(false);

    expect(services.updateRenderSettings).toHaveBeenCalledWith({ enableWordClickSearch: false });
  });

  test('nlp sub-settings slide in/out and update filter settings', async () => {
    const settings = createSettings();
    settings.filters.nlp.enabled = false;
    const services = createServicesMock(settings);
    const tab = createTab(services);
    tab.display();

    // Sub-settings container should not have the open class when NLP is disabled.
    const container = (tab.containerEl as unknown as {
      findByClass: (className: string) => { hasClass: (cls: string) => boolean } | null;
    }).findByClass('vault-word-cloud-settings-nlp-subsettings');
    expect(container).not.toBeNull();
    expect(container?.hasClass('is-open')).toBe(false);

    const enabledToggle = getControl('Enable Natural Language ProcessingNLP', 0) as {
      triggerChange: (value: boolean) => Promise<void>;
    };
    await enabledToggle.triggerChange(true);

    expect(container?.hasClass('is-open')).toBe(true);
    expect(services.updateFilterSettings).toHaveBeenCalledWith({
      nlp: expect.objectContaining({ enabled: true }),
    });

    await enabledToggle.triggerChange(false);
    expect(container?.hasClass('is-open')).toBe(false);
  });

  test('support buttons open template-specific GitHub issue forms', async () => {
    const services = createServicesMock();
    const tab = createTab(services);
    tab.display();

    const featureButton = (tab.containerEl as unknown as {
      findByClass: (className: string) => { trigger: (eventName: string) => Promise<void> } | null;
    }).findByClass('vault-word-cloud-settings-support-button-feature');
    const bugButton = (tab.containerEl as unknown as {
      findByClass: (className: string) => { trigger: (eventName: string) => Promise<void> } | null;
    }).findByClass('vault-word-cloud-settings-support-button-report');
    const openMock = (globalThis as any).window.open as jest.Mock;

    expect(featureButton).not.toBeNull();
    expect(bugButton).not.toBeNull();

    await bugButton?.trigger('click');
    await featureButton?.trigger('click');

    expect(openMock).toHaveBeenNthCalledWith(
      1,
      'https://github.com/stretchycritter/obsidian-word-clouds/issues/new?template=bug_report.yml',
      '_blank',
      'noopener,noreferrer',
    );
    expect(openMock).toHaveBeenNthCalledWith(
      2,
      'https://github.com/stretchycritter/obsidian-word-clouds/issues/new?template=feature_request.yml',
      '_blank',
      'noopener,noreferrer',
    );
  });
});

function createTab(services: MockServices): VaultWordCloudSettingTab {
  const plugin = { app: {} } as unknown as Plugin;
  return new VaultWordCloudSettingTab(plugin, services as any);
}

function createSettings() {
  return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

function createServicesMock(settings = createSettings()) {
  return {
    getAvailableTags: jest.fn(() => []),
    getAvailableFolders: jest.fn(() => []),
    getOpenMarkdownFiles: jest.fn(() => []),
    getActiveFile: jest.fn(() => null),
    getFilterSettings: jest.fn(() => settings.filters),
    updateFilterSettings: jest.fn().mockResolvedValue(undefined),
    collectVaultWords: jest.fn().mockResolvedValue([]),
    collectVaultWordsWithMetrics: jest.fn().mockResolvedValue({ words: [], metrics: { collectionMs: 0 } }),
    collectFileWords: jest.fn().mockResolvedValue([]),
    collectFileWordsWithMetrics: jest.fn().mockResolvedValue({ words: [], metrics: { collectionMs: 0 } }),
    drawWordCloud: jest.fn().mockResolvedValue(undefined),
    openSearchForWord: jest.fn().mockResolvedValue(undefined),
    getSettingsSnapshot: jest.fn(() => settings),
    getSupportedFontFamilyOptions: jest.fn(() => [{ value: 'sans-serif', label: 'Sans serif (default)' }]),
    getSelectedSupportedFontFamily: jest.fn((raw: string) => raw),
    getSettingsPreviewWords: jest.fn(() => [{ text: 'alpha', count: 5, size: 24 }]),
    updateMinimumFontSize: jest.fn().mockResolvedValue(settings.render),
    updateMaximumFontSize: jest.fn().mockResolvedValue(settings.render),
    updateRenderSettings: jest.fn().mockResolvedValue(undefined),
    resetAllSettings: jest.fn().mockResolvedValue(undefined),
    addExclusionListWord: jest.fn().mockResolvedValue(false),
    removeExclusionListWord: jest.fn().mockResolvedValue(undefined),
  };
}

function getControl(name: string, controlIndex: number): unknown {
  const settingInstances = obsidianMock.__mocks.MockSetting.instances;
  const setting = settingInstances.find((candidate) => candidate.name === name);
  if (!setting) {
    throw new Error(`Setting not found: ${name}`);
  }
  const control = setting.controls[controlIndex];
  if (!control) {
    throw new Error(`Control index ${controlIndex} not found for setting: ${name}`);
  }
  return control;
}
