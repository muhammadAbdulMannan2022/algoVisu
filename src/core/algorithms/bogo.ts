import { Algorithm } from '../types';

const generator = function* bogoSort(arr: number[]) {
  function isSorted() {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) return false;
    }
    return true;
  }
  let limit = 0;
  while (!isSorted()) {
    if (++limit > 200) { yield { type: 'done', log: 'Truncated slow funny sort' }; return; }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield { type: 'swap', i, j, log: `Randomize elements!` };
    }
  }
  for (let i = 0; i < arr.length; i++) yield { type: 'sorted', index: i };
  yield { type: 'done' };
};

export const bogoAlgo: Algorithm = {
  id: 'bogo',
  name: 'Bogo Sort',
  category: 'sort',
  complexity: 'O(n · n!)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
