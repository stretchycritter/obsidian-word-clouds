import { DEFAULT_SETTINGS } from '@/settings/constants';
import {
  cloneSettings,
  normalizeExclusionListWord,
  normalizeExclusionListWords,
  normalizeFilterSettings,
  normalizeRenderSettings,
  sortExclusionListWords,
} from '@/settings/settings-normalizers';

describe('settings-normalizers', () => {
  test('cloneSettings returns a deep copy', () => {
    const original = cloneSettings(DEFAULT_SETTINGS);
    const cloned = cloneSettings(original);

    cloned.exclusionListWords.push('extra');
    cloned.render.performanceMode = 'throttled';
    cloned.filters.scope.folderPaths?.push('folder');
    cloned.filters.includeTags.push('#test');
    cloned.filters.frontmatterRules.push({ key: 'status', operator: 'equals', value: 'done' });
    cloned.filters.minWordLength = 12;
    cloned.filters.frequency.minCount = 3;
    cloned.filters.nlp.mode = 'aggressive';
    cloned.filters.nlp.enabled = true;

    expect(original.exclusionListWords).not.toContain('extra');
    expect(original.render.performanceMode).toBe(DEFAULT_SETTINGS.render.performanceMode);
    expect(original.filters.scope.folderPaths).toEqual([]);
    expect(original.filters.includeTags).toEqual([]);
    expect(original.filters.frontmatterRules).toEqual([]);
    expect(original.filters.minWordLength).toBe(DEFAULT_SETTINGS.filters.minWordLength);
    expect(original.filters.frequency.minCount).toBe(DEFAULT_SETTINGS.filters.frequency.minCount);
    expect(original.filters.nlp).toEqual(DEFAULT_SETTINGS.filters.nlp);
  });

  test('normalizeExclusionListWord and sortExclusionListWords normalize values', () => {
    expect(normalizeExclusionListWord('  Alpha  ')).toBe('alpha');
    expect(sortExclusionListWords(['beta', 'alpha', 'gamma'])).toEqual(['alpha', 'beta', 'gamma']);
  });

  test('normalizeExclusionListWords deduplicates and falls back to defaults', () => {
    expect(normalizeExclusionListWords(['  Alpha', 'alpha', ' ', 10])).toEqual(['alpha']);
    expect(normalizeExclusionListWords('invalid')).toEqual(DEFAULT_SETTINGS.exclusionListWords);
    expect(normalizeExclusionListWords([' ', '   '])).toEqual(sortExclusionListWords([...DEFAULT_SETTINGS.exclusionListWords]));
  });

  test('normalizeFilterSettings sanitizes scope, tags, frontmatter, and frequency', () => {
    const normalized = normalizeFilterSettings({
      scope: {
        mode: 'folder',
        activeFilePath: '  Notes.md  ',
        folderPaths: [' A ', 'A', ' ', 42],
      },
      includeTags: ['Tag', '#Work', ''],
      excludeTags: ['#work', 'archive'],
      tagMatchMode: 'all',
      frontmatterRules: [
        { key: ' status ', operator: 'contains', value: 'done' },
        { key: 'empty-op', operator: 'bad-op', value: 'x' },
        { key: '  ', operator: 'equals', value: 'skip' },
      ],
      minWordLength: 0,
      frequency: {
        minCount: 20,
        maxCount: 5,
      },
      nlp: {
        enabled: true,
        mode: 'aggressive',
        preserveAcronyms: false,
        minLemmaLength: 1,
        filterNumericTokens: false,
      },
    });

    expect(normalized.scope).toEqual({
      mode: 'folder',
      activeFilePath: 'Notes.md',
      folderPaths: ['A'],
    });
    expect(normalized.includeTags).toEqual(['#tag', '#work']);
    expect(normalized.excludeTags).toEqual(['#archive']);
    expect(normalized.tagMatchMode).toBe('all');
    expect(normalized.frontmatterRules).toEqual([
      { key: 'status', operator: 'contains', value: 'done' },
      { key: 'empty-op', operator: 'equals', value: 'x' },
    ]);
    expect(normalized.minWordLength).toBe(1);
    expect(normalized.frequency).toEqual({
      minCount: 5,
      maxCount: 20,
    });
    expect(normalized.nlp).toEqual({
      enabled: true,
      mode: 'aggressive',
      preserveAcronyms: false,
      minLemmaLength: 2,
      filterNumericTokens: false,
    });
  });

  test('normalizeRenderSettings clamps values and applies enum fallbacks', () => {
    const normalized = normalizeRenderSettings({
      rotationPreset: 'bad',
      spiral: 'bad',
      wordPadding: -9,
      minFontSize: 1000,
      maxFontSize: 10,
      fontFamily: '  Georgia, serif  ',
      scalingMode: 'rank',
      emphasis: 9,
      wordTextMetric: 'bad',
      wordCaseMode: 'bad',
      showWordTextMetricToggle: 'bad',
      countLabelMinCount: 500,
      performanceMode: 'bad',
      scanBatchSize: 3,
      layoutTimeIntervalMs: 100,
      deterministicLayout: true,
      randomSeed: 0,
      enableMouseInteractions: false,
      enableControls: false,
      enableExporting: false,
    });

    expect(normalized.rotationPreset).toBe(DEFAULT_SETTINGS.render.rotationPreset);
    expect(normalized.spiral).toBe(DEFAULT_SETTINGS.render.spiral);
    expect(normalized.wordPadding).toBe(0);
    expect(normalized.minFontSize).toBe(16);
    expect(normalized.maxFontSize).toBe(16);
    expect(normalized.fontFamily).toBe('Georgia, serif');
    expect(normalized.scalingMode).toBe('rank');
    expect(normalized.emphasis).toBe(3);
    expect(normalized.wordTextMetric).toBe(DEFAULT_SETTINGS.render.wordTextMetric);
    expect(normalized.wordCaseMode).toBe(DEFAULT_SETTINGS.render.wordCaseMode);
    expect(normalized.showWordTextMetricToggle).toBe(DEFAULT_SETTINGS.render.showWordTextMetricToggle);
    expect(normalized.countLabelMinCount).toBe(100);
    expect(normalized.performanceMode).toBe(DEFAULT_SETTINGS.render.performanceMode);
    expect(normalized.scanBatchSize).toBe(8);
    expect(normalized.layoutTimeIntervalMs).toBe(40);
    expect(normalized.deterministicLayout).toBe(true);
    expect(normalized.randomSeed).toBe(1);
    expect(normalized.enableMouseInteractions).toBe(false);
    expect(normalized.enableControls).toBe(false);
    expect(normalized.enableExporting).toBe(false);
  });
});
