import { Algorithm } from '../types';

const generator = function* oddEvenSort(arr: number[]) {
  const n = arr.length;
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < n - 1; i += 2) {
      yield { type: 'compare', i, j: i + 1 };
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        yield { type: 'swap', i, j: i + 1 };
        sorted = false;
      }
    }
    for (let i = 0; i < n - 1; i += 2) {
      yield { type: 'compare', i, j: i + 1 };
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        yield { type: 'swap', i, j: i + 1 };
        sorted = false;
      }
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted', index: i };
  yield { type: 'done' };
};

export const oddevenAlgo: Algorithm = {
  id: 'oddeven',
  name: 'Odd-Even Sort',
  category: 'sort',
  complexity: 'O(n²)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
