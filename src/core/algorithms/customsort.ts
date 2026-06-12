import { Algorithm } from '../types';

const generator = function* customSort(arr: number[]) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    yield { type: 'active', index: i, log: `Scanned custom item index ${i}`, vars: { i, val: arr[i] } };
  }
  yield { type: 'done', log: 'Custom execution algorithm concluded!' };
};

export const customsortAlgo: Algorithm = {
  id: 'customsort',
  name: 'Custom Sandboxed Sorter',
  category: 'custom',
  complexity: 'O(?)',
  space: 'O(?)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
