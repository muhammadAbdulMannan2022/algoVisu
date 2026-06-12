import { Algorithm } from '../types';

const generator = function* selectionSort(arr: number[]) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield { type: 'active', index: i, log: `Set current index ${i} as minimum` };
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', i: minIdx, j, log: `Compare min candidate ${minIdx} with ${j}`, vars: { i, minIdx, j } };
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { type: 'swap', i, j: minIdx, log: `Swap min element into place` };
    }
    yield { type: 'sorted', index: i };
  }
  yield { type: 'sorted', index: n - 1 };
  yield { type: 'done' };
};

export const selectionAlgo: Algorithm = {
  id: 'selection',
  name: 'Selection Sort',
  category: 'sort',
  complexity: 'O(n²)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
