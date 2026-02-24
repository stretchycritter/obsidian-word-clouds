import { Disposer } from '@/disposer';

describe('Disposer', () => {
  test('disposes callbacks in reverse registration order', () => {
    const disposer = new Disposer();
    const calls: string[] = [];

    disposer.add(() => calls.push('first'));
    disposer.add(() => calls.push('second'));
    disposer.add(() => calls.push('third'));

    disposer.disposeAll();

    expect(calls).toEqual(['third', 'second', 'first']);
  });

  test('accepts object disposables with dispose method', () => {
    const disposer = new Disposer();
    const first = { dispose: jest.fn() };
    const second = { dispose: jest.fn() };

    disposer.add(first);
    disposer.add(second);
    disposer.disposeAll();

    expect(second.dispose).toHaveBeenCalledTimes(1);
    expect(first.dispose).toHaveBeenCalledTimes(1);
  });

  test('is safe to dispose when empty and when called multiple times', () => {
    const disposer = new Disposer();
    const callback = jest.fn();

    disposer.disposeAll();

    disposer.add(callback);
    disposer.disposeAll();
    disposer.disposeAll();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('runs all callbacks even when one errors, then throws after all complete', () => {
    const disposer = new Disposer();
    const earlier = jest.fn();
    const failing = jest.fn(() => {
      throw new Error('dispose failed');
    });

    disposer.add(earlier);
    disposer.add(failing);

    expect(() => disposer.disposeAll()).toThrow('dispose failed');
    expect(failing).toHaveBeenCalledTimes(1);
    expect(earlier).toHaveBeenCalledTimes(1);

    // Second call: callbacks already removed, nothing to throw
    disposer.disposeAll();
    expect(earlier).toHaveBeenCalledTimes(1);
  });
});
