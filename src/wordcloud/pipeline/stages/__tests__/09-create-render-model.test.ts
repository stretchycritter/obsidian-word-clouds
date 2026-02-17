import { createRenderModel } from '../09-create-render-model';
import type { AggregateResult, RenderModel, RenderModelStrategy } from '../../types';
import type { WeightedWord } from '../../../../types';

describe('createRenderModel', () => {
  it('delegates render model construction to the configured strategy', () => {
    const words: WeightedWord[] = [{ text: 'alpha', count: 3, size: 24 }];
    const aggregateResult: AggregateResult = {
      entries: [['alpha', 3]],
      totalTokens: 3,
      distinctTokens: 1,
    };

    const expected: RenderModel = {
      wordCloudWords: words,
      distributionSeries: [],
      totalTokens: 3,
      distinctTokens: 1,
    };

    const strategy: RenderModelStrategy = {
      buildModel(inputWords: WeightedWord[], inputAggregate: AggregateResult): RenderModel {
        expect(inputWords).toBe(words);
        expect(inputAggregate).toBe(aggregateResult);
        return expected;
      },
    };

    expect(createRenderModel(words, aggregateResult, strategy)).toBe(expected);
  });
});
