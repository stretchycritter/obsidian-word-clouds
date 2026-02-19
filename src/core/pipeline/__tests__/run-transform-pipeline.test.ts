import { runTransformPipeline } from '@/core/pipeline';
import type { PipelineDocument } from '@/core/types';
import { DEFAULT_SETTINGS } from '@/settings/constants';
import type { RenderSettings } from '@/settings/types';

describe('runTransformPipeline', () => {
  const renderSettings: RenderSettings = DEFAULT_SETTINGS.render;

  it('aggregates with the pipeline implementation and preserves output semantics', () => {
    const documents: PipelineDocument[] = [
      {
        id: 'a',
        path: 'A.md',
        basename: 'A',
        rawText: 'Alpha alpha beta the',
        tags: [],
        frontmatter: {},
      },
      {
        id: 'b',
        path: 'B.md',
        basename: 'B',
        rawText: 'beta gamma',
        tags: [],
        frontmatter: {},
      },
    ];

    const result = runTransformPipeline({
      documents,
      stopWords: new Set(['the']),
      renderSettings,
    });

    expect(result.totalTokens).toBe(5);
    expect(result.distinctTokens).toBe(3);
    expect(result.wordCloudWords.map((word) => [word.text, word.count])).toEqual([
      ['alpha', 2],
      ['beta', 2],
      ['gamma', 1],
    ]);
  });
});
