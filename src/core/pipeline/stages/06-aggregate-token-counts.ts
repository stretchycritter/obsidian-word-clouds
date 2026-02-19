import type { AggregateResult, Token } from '@/core/pipeline/types';

const MAX_WORDS = 140;
type CountRecord = { count: number; firstSeen: number };
type RankedCount = { text: string; count: number; firstSeen: number };

export function aggregateTokens(tokens: Token[]): AggregateResult {
  const counts = new Map<string, CountRecord>();
  let firstSeen = 0;

  for (const token of tokens) {
    const existing = counts.get(token.value);
    if (existing) {
      existing.count += 1;
      continue;
    }

    counts.set(token.value, {
      count: 1,
      firstSeen,
    });
    firstSeen += 1;
  }

  const entries = selectTopEntries(counts, MAX_WORDS);

  return {
    entries,
    totalTokens: tokens.length,
    distinctTokens: counts.size,
  };
}

export function selectTopEntries(
  counts: Map<string, CountRecord>,
  maxWords: number = MAX_WORDS,
): Array<[string, number]> {
  if (counts.size === 0 || maxWords <= 0) {
    return [];
  }

  const heap: RankedCount[] = [];
  for (const [text, value] of counts) {
    const nextEntry: RankedCount = {
      text,
      count: value.count,
      firstSeen: value.firstSeen,
    };

    if (heap.length < maxWords) {
      heapPush(heap, nextEntry);
      continue;
    }

    const smallest = heap[0];
    if (smallest && isBetter(nextEntry, smallest)) {
      heap[0] = nextEntry;
      siftDown(heap, 0);
    }
  }

  return heap
    .sort(compareByRank)
    .map((entry) => [entry.text, entry.count]);
}

function compareByRank(a: RankedCount, b: RankedCount): number {
  return b.count - a.count || a.firstSeen - b.firstSeen;
}

function isBetter(a: RankedCount, b: RankedCount): boolean {
  return a.count > b.count || (a.count === b.count && a.firstSeen < b.firstSeen);
}

function isWorse(a: RankedCount, b: RankedCount): boolean {
  return a.count < b.count || (a.count === b.count && a.firstSeen > b.firstSeen);
}

function heapPush(heap: RankedCount[], value: RankedCount): void {
  heap.push(value);
  siftUp(heap, heap.length - 1);
}

function siftUp(heap: RankedCount[], index: number): void {
  let current = index;
  while (current > 0) {
    const parent = Math.floor((current - 1) / 2);
    const parentValue = heap[parent];
    const currentValue = heap[current];
    if (!parentValue || !currentValue || !isWorse(parentValue, currentValue)) {
      return;
    }

    heap[parent] = currentValue;
    heap[current] = parentValue;
    current = parent;
  }
}

function siftDown(heap: RankedCount[], index: number): void {
  let current = index;
  const size = heap.length;

  while (true) {
    const left = current * 2 + 1;
    const right = left + 1;
    let next = current;
    const currentValue = heap[current];
    if (!currentValue) {
      return;
    }

    const leftValue = left < size ? heap[left] : undefined;
    const nextValue = heap[next];
    if (leftValue && nextValue && isWorse(leftValue, nextValue)) {
      next = left;
    }

    const rightValue = right < size ? heap[right] : undefined;
    const updatedNextValue = heap[next];
    if (rightValue && updatedNextValue && isWorse(rightValue, updatedNextValue)) {
      next = right;
    }

    if (next === current) {
      return;
    }

    const swapValue = heap[next];
    if (!swapValue) {
      return;
    }
    heap[current] = swapValue;
    heap[next] = currentValue;
    current = next;
  }
}
