import { Algorithm } from '../types';

const generator = function* countingSort(arr: number[]) {
  const maxVal = Math.max(...arr, 1);
  const count = Array(maxVal + 1).fill(0);
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
    yield { type: 'active', index: i, log: `Counting occurrence of ${arr[i]}` };
  }
  let idx = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      arr[idx] = i;
      yield { type: 'swap', i: idx, j: idx, log: `Overwriting elements back in sorted order` };
      yield { type: 'sorted', index: idx };
      idx++;
      count[i]--;
    }
  }
  yield { type: 'done' };
};

export const countingAlgo: Algorithm = {
  id: 'counting',
  name: 'Counting Sort',
  category: 'sort',
  complexity: 'O(n+k)',
  space: 'O(n+k)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
