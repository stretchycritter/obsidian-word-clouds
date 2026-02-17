import { openSearchForWord } from '../apply-search';

interface MockLeaf {
  setViewState: jest.Mock<Promise<void>, [unknown]>;
}

describe('openSearchForWord', () => {
  function createApp(overrides?: {
    existingLeaf?: MockLeaf | null;
    rightLeaf?: MockLeaf | null;
    fallbackLeaf?: MockLeaf | null;
  }): {
    app: {
      workspace: {
        getLeavesOfType: jest.Mock;
        getRightLeaf: jest.Mock;
        getLeaf: jest.Mock;
        revealLeaf: jest.Mock;
      };
    };
    leaves: {
      existingLeaf: MockLeaf;
      rightLeaf: MockLeaf;
      fallbackLeaf: MockLeaf;
    };
  } {
    const existingLeaf: MockLeaf = {
      setViewState: jest.fn().mockResolvedValue(undefined),
    };
    const rightLeaf: MockLeaf = {
      setViewState: jest.fn().mockResolvedValue(undefined),
    };
    const fallbackLeaf: MockLeaf = {
      setViewState: jest.fn().mockResolvedValue(undefined),
    };

    const app = {
      workspace: {
        getLeavesOfType: jest.fn().mockReturnValue(
          overrides?.existingLeaf === undefined
            ? [existingLeaf]
            : overrides.existingLeaf
              ? [overrides.existingLeaf]
              : [],
        ),
        getRightLeaf: jest.fn().mockReturnValue(overrides?.rightLeaf === undefined ? rightLeaf : overrides.rightLeaf),
        getLeaf: jest
          .fn()
          .mockReturnValue(overrides?.fallbackLeaf === undefined ? fallbackLeaf : overrides.fallbackLeaf),
        revealLeaf: jest.fn(),
      },
    };

    return { app, leaves: { existingLeaf, rightLeaf, fallbackLeaf } };
  }

  test('opens search in an existing search leaf and builds an OR include-tag query by default', async () => {
    const { app, leaves } = createApp();

    await openSearchForWord(app as never, 'project "alpha"', {
      filePath: 'Folder/"Roadmap".md',
      includeTags: [' Work ', '#Feature'],
      excludeTags: [' archived ', '#Old'],
    });

    expect(leaves.existingLeaf.setViewState).toHaveBeenCalledWith({
      type: 'search',
      active: true,
      state: {
        query: '"project \\"alpha\\"" path:"Folder/\\"Roadmap\\".md" (#work OR #feature) -#archived -#old',
      },
    });
    expect(app.workspace.revealLeaf).toHaveBeenCalledWith(leaves.existingLeaf);
    expect(app.workspace.getRightLeaf).not.toHaveBeenCalled();
    expect(app.workspace.getLeaf).not.toHaveBeenCalled();
  });

  test('uses tagMatchMode all and appends include tags separately', async () => {
    const { app, leaves } = createApp();

    await openSearchForWord(app as never, 'word', {
      includeTags: ['a', 'B'],
      tagMatchMode: 'all',
    });

    expect(leaves.existingLeaf.setViewState).toHaveBeenCalledWith({
      type: 'search',
      active: true,
      state: {
        query: '"word" #a #b',
      },
    });
  });

  test('falls back to right leaf when no search leaf exists', async () => {
    const { app } = createApp({ existingLeaf: null });

    await openSearchForWord(app as never, 'word');

    expect(app.workspace.getRightLeaf).toHaveBeenCalledWith(false);
    expect(app.workspace.revealLeaf).toHaveBeenCalledWith(app.workspace.getRightLeaf.mock.results[0].value);
  });

  test('falls back to getLeaf(true) when right leaf is unavailable', async () => {
    const { app } = createApp({ existingLeaf: null, rightLeaf: null });

    await openSearchForWord(app as never, 'word');

    expect(app.workspace.getRightLeaf).toHaveBeenCalledWith(false);
    expect(app.workspace.getLeaf).toHaveBeenCalledWith(true);
    expect(app.workspace.revealLeaf).toHaveBeenCalledWith(app.workspace.getLeaf.mock.results[0].value);
  });

  test('returns without opening search when no leaf can be created', async () => {
    const { app } = createApp({ existingLeaf: null, rightLeaf: null, fallbackLeaf: null });

    await openSearchForWord(app as never, 'word');

    expect(app.workspace.revealLeaf).not.toHaveBeenCalled();
  });
});
