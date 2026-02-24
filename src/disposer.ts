export type Disposable = { dispose: () => void };

type DisposeCallback = () => void;

export class Disposer {
  private readonly callbacks: DisposeCallback[] = [];

  add(disposable: Disposable | DisposeCallback): void {
    if (typeof disposable === 'function') {
      this.callbacks.push(disposable);
      return;
    }

    this.callbacks.push(() => {
      disposable.dispose();
    });
  }

  disposeAll(): void {
    while (this.callbacks.length > 0) {
      const callback = this.callbacks.pop();
      if (!callback) continue;
      try {
        callback();
      } catch (err) {
        console.error('[WordCloud] Error during disposal:', err);
        throw err;
      }
    }
  }
}
