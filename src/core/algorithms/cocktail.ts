import { Algorithm } from '../types';

const generator = function* cocktailSort(arr: number[]) {
  let swapped = true;
  let start = 0, end = arr.length - 1;
  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      yield { type: 'compare', i, j: i + 1, log: `Scan forwards` };
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        yield { type: 'swap', i, j: i + 1 };
        swapped = true;
      }
    }
    if (!swapped) break;
    swapped = false;
    end--;
    for (let i = end - 1; i >= start; i--) {
      yield { type: 'compare', i, j: i + 1, log: `Scan backwards` };
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        yield { type: 'swap', i, j: i + 1 };
        swapped = true;
      }
    }
    start++;
  }
  for (let i = 0; i < arr.length; i++) yield { type: 'sorted', index: i };
  yield { type: 'done' };
};

export const cocktailAlgo: Algorithm = {
  id: 'cocktail',
  name: 'Cocktail Shaker Sort',
  category: 'sort',
  complexity: 'O(n²)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
