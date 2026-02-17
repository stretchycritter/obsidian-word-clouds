import { escapeForSearch, normalizeTag } from '../utils';

describe('normalizeTag', () => {
  test('returns an empty string for whitespace-only input', () => {
    expect(normalizeTag('   ')).toBe('');
  });

  test('trims, lowercases, and adds a leading hash when missing', () => {
    expect(normalizeTag('  Project/Alpha  ')).toBe('#project/alpha');
  });

  test('trims and lowercases while preserving an existing leading hash', () => {
    expect(normalizeTag('  #MiXeD/Tag  ')).toBe('#mixed/tag');
  });
});

describe('escapeForSearch', () => {
  test('escapes double quotes in the provided value', () => {
    expect(escapeForSearch('He said "hello"')).toBe('He said \\"hello\\"');
  });

  test('leaves values without double quotes unchanged', () => {
    expect(escapeForSearch('plain text')).toBe('plain text');
  });
});
