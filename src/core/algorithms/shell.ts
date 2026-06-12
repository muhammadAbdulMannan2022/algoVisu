import { Algorithm } from '../types';

const generator = function* shellSort(arr: number[]) {
  const n = arr.length;
  let gap = Math.floor(n / 2);
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap) {
        yield { type: 'compare', i: j - gap, j, log: `Gap-compare indices with gap size ${gap}`, vars: { gap, i, j } };
        if (arr[j - gap] > temp) {
          arr[j] = arr[j - gap];
          yield { type: 'swap', i: j, j: j - gap };
          j -= gap;
        } else break;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted', index: i };
  yield { type: 'done' };
};

export const shellAlgo: Algorithm = {
  id: 'shell',
  name: 'Shell Sort',
  category: 'sort',
  complexity: 'O(n log² n)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
