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
    const errors: unknown[] = [];
    while (this.callbacks.length > 0) {
      const callback = this.callbacks.pop();
      if (!callback) continue;
      try {
        callback();
      } catch (err) {
        console.error('[WordCloud] Error during disposal:', err);
        errors.push(err);
      }
    }
    if (errors.length > 0) {
      if (errors.length === 1) {
        throw errors[0];
      }
      const messages = errors.map((e) => (e instanceof Error ? e.message : String(e))).join('; ');
      throw new Error(`[WordCloud] Multiple disposal errors: ${messages}`);
    }
  }
}
