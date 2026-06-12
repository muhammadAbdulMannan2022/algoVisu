import { Algorithm } from '../types';

const generator = function* hoareQuickSort(arr: number[]) {
  function* partition(lo: number, hi: number): Generator<any, number, any> {
    const pivot = arr[lo];
    let i = lo - 1, j = hi + 1;
    yield { type: 'pivot', index: lo, log: `Pivot selected: ${pivot}` };
    while (true) {
      do { j--; yield { type: 'compare', i: lo, j, log: `Scan left from right` }; } while (arr[j] > pivot);
      do { i++; yield { type: 'compare', i, j: lo, log: `Scan right from left` }; } while (arr[i] < pivot);
      if (i >= j) return j;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield { type: 'swap', i, j, log: `Swap elements` };
    }
  }
  function* sort(lo: number, hi: number): Generator<any, void, any> {
    if (lo < hi) {
      const p = yield* partition(lo, hi);
      yield* sort(lo, p);
      yield* sort(p + 1, hi);
    }
  }
  yield* sort(0, arr.length - 1);
  for (let x = 0; x < arr.length; x++) yield { type: 'sorted', index: x };
  yield { type: 'done' };
};

export const quickhoareAlgo: Algorithm = {
  id: 'quickhoare',
  name: 'Quick Sort (Hoare)',
  category: 'sort',
  complexity: 'O(n log n)',
  space: 'O(log n)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
