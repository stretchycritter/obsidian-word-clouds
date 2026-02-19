import { processTokensNlp } from '@/core/pipeline/stages/04b-process-tokens-nlp';
import type { Token } from '@/core/pipeline/types';

const baseToken = (value: string, overrides: Partial<Token> = {}): Token => ({
  rawValue: value,
  value: value.toLowerCase(),
  documentId: 'doc-1',
  ...overrides,
});

describe('processTokensNlp', () => {
  it('returns tokens unchanged when disabled', () => {
    const tokens = [baseToken('running'), baseToken('ideas')];
    expect(processTokensNlp(tokens, {
      enabled: false,
      mode: 'off',
      preserveAcronyms: true,
      minLemmaLength: 3,
      filterNumericTokens: true,
    })).toEqual(tokens);
  });

  it('applies light stemming and numeric filtering', () => {
    const tokens = [
      baseToken('running'),
      baseToken('stories'),
      baseToken('1024', { flags: { isNumeric: true } }),
    ];

    expect(processTokensNlp(tokens, {
      enabled: true,
      mode: 'light',
      preserveAcronyms: true,
      minLemmaLength: 3,
      filterNumericTokens: true,
    }).map((token) => token.value)).toEqual(['runn', 'story']);
  });

  it('preserves acronym tokens when configured', () => {
    const tokens = [baseToken('API', {
      value: 'api',
      flags: { isAcronym: true },
    })];

    expect(processTokensNlp(tokens, {
      enabled: true,
      mode: 'aggressive',
      preserveAcronyms: true,
      minLemmaLength: 3,
      filterNumericTokens: true,
    })[0]?.value).toBe('api');
  });

  it('returns tokens unchanged when mode is off even if enabled', () => {
    const tokens = [baseToken('running'), baseToken('stories')];

    expect(processTokensNlp(tokens, {
      enabled: true,
      mode: 'off',
      preserveAcronyms: true,
      minLemmaLength: 3,
      filterNumericTokens: true,
    })).toEqual(tokens);
  });

  it('strips possessives and outer punctuation in light mode', () => {
    const tokens = [
      baseToken("'Runner's'", { value: "'runner's'" }),
      baseToken('--stories--'),
    ];

    expect(processTokensNlp(tokens, {
      enabled: true,
      mode: 'light',
      preserveAcronyms: false,
      minLemmaLength: 3,
      filterNumericTokens: false,
    }).map((token) => token.value)).toEqual(['runner', 'story']);
  });

  it('removes internal apostrophes and hyphens in aggressive mode', () => {
    const tokens = [
      baseToken("don't", { value: "don't" }),
      baseToken('state-of-the-art', { value: 'state-of-the-art' }),
    ];

    expect(processTokensNlp(tokens, {
      enabled: true,
      mode: 'aggressive',
      preserveAcronyms: false,
      minLemmaLength: 3,
      filterNumericTokens: false,
    }).map((token) => token.value)).toEqual(['dont', 'stateoftheart']);
  });

  it('respects min lemma length before and after suffix normalization', () => {
    const tokens = [
      baseToken('boxes'),
      baseToken('cats'),
      baseToken('is'),
    ];

    expect(processTokensNlp(tokens, {
      enabled: true,
      mode: 'aggressive',
      preserveAcronyms: false,
      minLemmaLength: 4,
      filterNumericTokens: false,
    }).map((token) => token.value)).toEqual(['boxe', 'cats', 'is']);
  });

  it('sets normalizedByNlp only when token value changes', () => {
    const tokens = [baseToken('running'), baseToken('alpha')];
    const result = processTokensNlp(tokens, {
      enabled: true,
      mode: 'light',
      preserveAcronyms: false,
      minLemmaLength: 3,
      filterNumericTokens: false,
    });

    expect(result[0]?.flags?.normalizedByNlp).toBe(true);
    expect(result[1]?.flags?.normalizedByNlp).toBe(false);
  });

  it('drops tokens that become empty after normalization', () => {
    const tokens = [
      baseToken("''", { value: "''" }),
      baseToken('---', { value: '---' }),
      baseToken('word'),
    ];

    expect(processTokensNlp(tokens, {
      enabled: true,
      mode: 'light',
      preserveAcronyms: false,
      minLemmaLength: 3,
      filterNumericTokens: false,
    }).map((token) => token.value)).toEqual(['word']);
  });
});
