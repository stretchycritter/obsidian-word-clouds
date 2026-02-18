import type { SourceSelectionRules } from '../../../settings/types';
import type { PipelineDocument } from '../types';
import { normalizeTag } from '../../../utils/utils';

export function selectDocuments(documents: PipelineDocument[], rules?: SourceSelectionRules): PipelineDocument[] {
  if (!rules) {
    return documents;
  }

  const includeTags = (rules.includeTags ?? [])
    .map((tag) => normalizeTag(tag))
    .filter((tag) => tag.length > 0);
  const excludeTags = (rules.excludeTags ?? [])
    .map((tag) => normalizeTag(tag))
    .filter((tag) => tag.length > 0);

  const scope = rules.scope;
  const activeFilePath = scope?.activeFilePath?.trim() ?? '';
  const folderPaths = (scope?.folderPaths ?? []).map((prefix) => prefix.trim()).filter(Boolean);
  const frontmatterRules = (rules.frontmatterRules ?? [])
    .filter((rule) => rule.key.trim().length > 0);
  const queryText = rules.queryText?.trim().toLowerCase() ?? '';
  const tagMatchMode = rules.tagMatchMode ?? 'any';

  return documents.filter((document) => {
    if (!matchesScope(document.path, scope?.mode ?? 'vault', activeFilePath, folderPaths)) {
      return false;
    }

    if (includeTags.length > 0 && !matchesTagRules(document.tags, includeTags, tagMatchMode)) {
      return false;
    }

    if (excludeTags.length > 0 && matchesAnyTag(document.tags, excludeTags)) {
      return false;
    }

    if (frontmatterRules.length > 0 && !matchesFrontmatterRules(document.frontmatter, frontmatterRules)) {
      return false;
    }

    if (queryText.length > 0 && !matchesQueryText(document, queryText)) {
      return false;
    }

    return true;
  });
}

function matchesTagRules(documentTags: string[], filters: string[], mode: 'any' | 'all'): boolean {
  const normalizedTags = new Set(documentTags.map((tag) => normalizeTag(tag)).filter(Boolean));
  if (mode === 'all') {
    return filters.every((filterTag) => normalizedTags.has(filterTag));
  }

  return filters.some((filterTag) => normalizedTags.has(filterTag));
}

function matchesAnyTag(documentTags: string[], filters: string[]): boolean {
  const normalizedTags = new Set(documentTags.map((tag) => normalizeTag(tag)).filter(Boolean));
  return filters.some((filterTag) => normalizedTags.has(filterTag));
}

function matchesScope(path: string, mode: 'vault' | 'active-file' | 'folder', activeFilePath: string, folderPaths: string[]): boolean {
  if (mode === 'active-file') {
    return activeFilePath.length > 0 && path === activeFilePath;
  }

  if (mode === 'folder') {
    if (folderPaths.length === 0) {
      return false;
    }

    return folderPaths.some((folderPath) => path === folderPath || path.startsWith(`${folderPath}/`));
  }

  return true;
}

function matchesFrontmatterRules(
  frontmatter: Record<string, unknown>,
  rules: SourceSelectionRules['frontmatterRules'],
): boolean {
  if (!rules) {
    return true;
  }

  return rules.every((rule) => {
    const key = rule.key.trim();
    if (!key) {
      return true;
    }

    const actual = frontmatter[key];
    const expected = (rule.value ?? '').trim();

    if (rule.operator === 'exists') {
      return actual !== undefined;
    }
    if (rule.operator === 'not-exists') {
      return actual === undefined;
    }

    if (actual === undefined) {
      return false;
    }

    if (rule.operator === 'contains') {
      return containsValue(actual, expected);
    }

    if (rule.operator === 'equals') {
      return compareScalar(actual, expected) === 0;
    }
    if (rule.operator === 'not-equals') {
      return compareScalar(actual, expected) !== 0;
    }
    if (rule.operator === 'gt') {
      return compareScalar(actual, expected) > 0;
    }
    if (rule.operator === 'gte') {
      return compareScalar(actual, expected) >= 0;
    }
    if (rule.operator === 'lt') {
      return compareScalar(actual, expected) < 0;
    }
    if (rule.operator === 'lte') {
      return compareScalar(actual, expected) <= 0;
    }

    return true;
  });
}

function containsValue(actual: unknown, expected: string): boolean {
  const normalizedExpected = expected.toLowerCase();
  if (Array.isArray(actual)) {
    return actual.some((entry) => String(entry).toLowerCase().includes(normalizedExpected));
  }

  return String(actual).toLowerCase().includes(normalizedExpected);
}

function compareScalar(actual: unknown, expected: string): number {
  const numericActual = tryParseNumber(actual);
  const numericExpected = tryParseNumber(expected);
  if (numericActual !== null && numericExpected !== null) {
    return numericActual - numericExpected;
  }

  const dateActual = tryParseDate(actual);
  const dateExpected = tryParseDate(expected);
  if (dateActual !== null && dateExpected !== null) {
    return dateActual - dateExpected;
  }

  const booleanActual = tryParseBoolean(actual);
  const booleanExpected = tryParseBoolean(expected);
  if (booleanActual !== null && booleanExpected !== null) {
    if (booleanActual === booleanExpected) {
      return 0;
    }
    return booleanActual ? 1 : -1;
  }

  return String(actual).localeCompare(expected, undefined, { sensitivity: 'base', numeric: true });
}

function tryParseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function tryParseDate(value: unknown): number | null {
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

function tryParseBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }

  return null;
}

function matchesQueryText(document: PipelineDocument, queryText: string): boolean {
  return document.path.toLowerCase().includes(queryText)
    || document.basename.toLowerCase().includes(queryText)
    || document.rawText.toLowerCase().includes(queryText);
}
