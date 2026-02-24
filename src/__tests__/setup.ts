// Shared Obsidian virtual mock registered globally for all test suites.
// Individual test files may call jest.mock('obsidian', ...) again to override
// or extend this mock with test-specific shapes.
jest.mock(
  'obsidian',
  () => ({
    Plugin: class {
      app: unknown;
      constructor(app: unknown) {
        this.app = app;
      }
    },
    moment: {
      locale: jest.fn(),
    },
    Modal: class {
      app: unknown;
      constructor(app: unknown) {
        this.app = app;
      }
      open(): void {}
      close(): void {}
    },
    Notice: jest.fn(),
    MarkdownRenderer: {
      renderMarkdown: jest.fn(),
    },
    normalizePath: (path: string) => path.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\/|\/$/g, ''),
  }),
  { virtual: true },
);
