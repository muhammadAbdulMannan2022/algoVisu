import { Algorithm } from '../types';

const generator = function* insertionSort(arr: number[]) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    yield { type: 'active', index: i, log: `Pick element ${key} at index ${i}` };
    while (j >= 0) {
      yield { type: 'compare', i: j, j: i, log: `Compare arr[${j}]=${arr[j]} with key ${key}`, vars: { i, j, key } };
      if (arr[j] <= key) break;
      arr[j + 1] = arr[j];
      yield { type: 'swap', i: j, j: j + 1, log: `Shift arr[${j}] to index ${j+1}` };
      j--;
    }
    arr[j + 1] = key;
    yield { type: 'sorted', index: j + 1 };
  }
  yield { type: 'done' };
};

export const insertionAlgo: Algorithm = {
  id: 'insertion',
  name: 'Insertion Sort',
  category: 'sort',
  complexity: 'O(n²)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
