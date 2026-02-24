/**
 * EventCoordinator is intentional scaffolding for future debounce and batch coordination
 * features. It is instantiated in `src/types.ts` (inside the `Deps` type) to reserve a
 * disposal slot that future event listeners can register against. When listeners are added,
 * they should unsubscribe inside `dispose()` so that `Deps.dispose()` can call through to
 * this coordinator cleanly without needing structural changes.
 *
 * No listeners are registered yet — the class body is deliberately empty.
 */
export class EventCoordinator {
  dispose(): void {
    // Reserved for debounced/batched orchestration policies.
    // Future listeners registered on vault/workspace events will be torn down here.
  }
}
