import { Algorithm } from '../types';

const generator = function* cycleSort(arr: number[]) {
  const n = arr.length;
  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = arr[cycleStart];
    let pos = cycleStart;
    for (let i = cycleStart + 1; i < n; i++) {
      yield { type: 'compare', i: cycleStart, j: i };
      if (arr[i] < item) pos++;
    }
    if (pos === cycleStart) continue;
    while (item === arr[pos]) pos++;
    [arr[pos], item] = [item, arr[pos]];
    yield { type: 'swap', i: cycleStart, j: pos };
    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        yield { type: 'compare', i: cycleStart, j: i };
        if (arr[i] < item) pos++;
      }
      while (item === arr[pos]) pos++;
      [arr[pos], item] = [item, arr[pos]];
      yield { type: 'swap', i: cycleStart, j: pos };
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted', index: i };
  yield { type: 'done' };
};

export const cycleAlgo: Algorithm = {
  id: 'cycle',
  name: 'Cycle Sort',
  category: 'sort',
  complexity: 'O(n²)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
