import type { App, TFile } from 'obsidian';
import type { SourceSelectionRules } from '@/settings/types';

type FilePredicate = (file: TFile) => boolean;

export function compileFrontmatterPredicate(app: App, rules: SourceSelectionRules): FilePredicate | null {
  const frontmatterRules = (rules.frontmatterRules ?? []).filter((rule) => rule.key.trim().length > 0);
  if (frontmatterRules.length === 0) {
    return null;
  }

  return (file: TFile) => {
    const cache = app.metadataCache.getFileCache(file);
    const frontmatter = cache?.frontmatter && typeof cache.frontmatter === 'object'
      ? (cache.frontmatter as Record<string, unknown>)
      : {};
    return matchesFrontmatterRules(frontmatter, frontmatterRules);
  };
}

export function matchesFrontmatterRules(
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
  if (isNullLike(expected)) {
    return isNullLike(actual) ? 0 : 1;
  }

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

function isNullLike(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === 'null' || normalized === '~' || normalized === 'nil';
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
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (value instanceof Date) {
    const timestamp = value.getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
  }

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
