/**
 * Generates a unique identifier for a word cloud embed block.
 * Uses crypto.randomUUID() when available, with a Date.now + Math.random fallback
 * for environments where crypto is not available.
 *
 * Shared utility — previously duplicated in commands/register.ts and ui/modals/edit-word-cloud-modal.ts.
 */
export function generateCloudId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `wc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
