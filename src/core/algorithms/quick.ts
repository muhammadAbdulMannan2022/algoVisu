import { Algorithm } from '../types';

const generator = function* quickSort(arr: number[]) {
  function* partition(lo: number, hi: number): Generator<any, number, any> {
    const pivot = arr[hi];
    let pi = lo;
    yield { type: 'pivot', index: hi, log: `Select pivot element ${pivot} at index ${hi}`, vars: { lo, hi, pivot } };
    for (let j = lo; j < hi; j++) {
      yield { type: 'compare', i: pi, j, log: `Compare arr[${j}]=${arr[j]} with pivot ${pivot}`, vars: { j, pi, pivot } };
      if (arr[j] <= pivot) {
        if (pi !== j) {
          [arr[pi], arr[j]] = [arr[j], arr[pi]];
          yield { type: 'swap', i: pi, j, log: `Swap elements at ${pi} & ${j}` };
        }
        pi++;
      }
    }
    [arr[pi], arr[hi]] = [arr[hi], arr[pi]];
    yield { type: 'swap', i: pi, j: hi, log: `Place pivot at index ${pi}` };
    yield { type: 'sorted', index: pi };
    return pi;
  }
  function* sort(lo: number, hi: number): Generator<any, void, any> {
    if (lo >= hi) {
      if (lo >= 0 && lo < arr.length) yield { type: 'sorted', index: lo };
      return;
    }
    const p = yield* partition(lo, hi);
    yield* sort(lo, p - 1);
    yield* sort(p + 1, hi);
  }
  yield* sort(0, arr.length - 1);
  yield { type: 'done' };
};

export const quickAlgo: Algorithm = {
  id: 'quick',
  name: 'Quick Sort (Lomuto)',
  category: 'sort',
  complexity: 'O(n log n)',
  space: 'O(log n)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
