import { scaleBand, scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import type { WeightedWord } from '@/wordcloud/types';

type FrequencyChartRenderOptions = {
  containerEl: HTMLDivElement;
  words: WeightedWord[];
  ariaLabel: string;
};

export function drawFrequencyChart(options: FrequencyChartRenderOptions): void {
  const { containerEl, words, ariaLabel } = options;

  containerEl.empty();

  const sortedWords = words
    .map((entry) => ({ text: entry.text, count: entry.count }))
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));

  if (sortedWords.length === 0) {
    containerEl.createDiv({
      cls: 'vault-word-cloud-state',
      text: 'No frequency data available.',
    });
    return;
  }

  const width = Math.max(containerEl.clientWidth, 320);
  const longestLabelLength = sortedWords.reduce((maxChars, entry) => {
    return Math.max(maxChars, entry.text.length);
  }, 0);

  const margin = {
    top: 8,
    right: 56,
    bottom: 8,
    left: Math.min(280, Math.max(120, Math.round(longestLabelLength * 7.2))),
  };

  const rowHeight = 22;
  const chartHeight = Math.max(120, sortedWords.length * rowHeight);
  const totalHeight = margin.top + chartHeight + margin.bottom;

  const x = scaleLinear()
    .domain([0, sortedWords[0]?.count ?? 1])
    .range([margin.left, width - margin.right]);

  const y = scaleBand<string>()
    .domain(sortedWords.map((entry) => entry.text))
    .range([margin.top, margin.top + chartHeight])
    .paddingInner(0.2);

  const svg = select(containerEl)
    .append('svg')
    .attr('class', 'note-word-cloud-frequency-svg')
    .attr('width', width)
    .attr('height', totalHeight)
    .attr('role', 'img')
    .attr('aria-label', ariaLabel)
    .style('display', 'block');

  const rows = svg
    .append('g')
    .attr('class', 'note-word-cloud-frequency-rows')
    .selectAll('g')
    .data(sortedWords)
    .join('g')
    .attr('transform', (entry) => `translate(0, ${y(entry.text) ?? 0})`);

  rows
    .append('text')
    .attr('class', 'note-word-cloud-frequency-label')
    .attr('x', margin.left - 8)
    .attr('y', Math.max(0, y.bandwidth() / 2))
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .text((entry) => entry.text);

  rows
    .append('rect')
    .attr('class', 'note-word-cloud-frequency-bar')
    .attr('x', margin.left)
    .attr('y', 0)
    .attr('height', Math.max(1, y.bandwidth()))
    .attr('width', (entry) => Math.max(1, x(entry.count) - margin.left));

  rows
    .append('text')
    .attr('class', 'note-word-cloud-frequency-value')
    .attr('x', (entry) => x(entry.count) + 6)
    .attr('y', Math.max(0, y.bandwidth() / 2))
    .attr('dominant-baseline', 'middle')
    .text((entry) => String(entry.count));

  containerEl.createDiv({
    cls: 'note-word-cloud-frequency-summary',
    text: `${sortedWords.length} words, sorted by frequency`,
  });
}
