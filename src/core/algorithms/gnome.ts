import { Algorithm } from '../types';

const generator = function* gnomeSort(arr: number[]) {
  let idx = 0;
  while (idx < arr.length) {
    if (idx === 0) idx++;
    yield { type: 'compare', i: idx, j: idx - 1, log: `Gnome compare indices` };
    if (arr[idx] >= arr[idx - 1]) idx++;
    else {
      [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]];
      yield { type: 'swap', i: idx, j: idx - 1, log: `Gnome swap elements backwards` };
      idx--;
    }
  }
  for (let i = 0; i < arr.length; i++) yield { type: 'sorted', index: i };
  yield { type: 'done' };
};

export const gnomeAlgo: Algorithm = {
  id: 'gnome',
  name: 'Gnome Sort',
  category: 'sort',
  complexity: 'O(n²)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
