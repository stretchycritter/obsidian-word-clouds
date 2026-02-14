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

export function getSelectedMultiValues(selectEl: HTMLSelectElement): string[] {
  return Array.from(selectEl.selectedOptions).map((option) => option.value);
}
