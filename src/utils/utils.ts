export function normalizeTag(tag: string): string {
  const trimmed = tag.trim().toLowerCase();
  if (!trimmed) {
    return '';
  }

  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
}

export function escapeForSearch(value: string): string {
  return value.replace(/"/g, '\\"');
}
