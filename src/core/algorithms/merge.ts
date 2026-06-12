import { Algorithm } from '../types';

const generator = function* mergeSort(arr: number[]) {
  function* merge(l: number, m: number, r: number): Generator<any, void, any> {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      yield { type: 'compare', i: l + i, j: m + 1 + j, log: `Compare left subarray element with right subarray`, vars: { l, m, r, i, j } };
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
      yield { type: 'swap', i: k - 1, j: k - 1, log: `Overwrote index ${k-1}` };
    }
    while (i < left.length) { arr[k++] = left[i++]; yield { type: 'swap', i: k - 1, j: k - 1 }; }
    while (j < right.length) { arr[k++] = right[j++]; yield { type: 'swap', i: k - 1, j: k - 1 }; }
    for (let x = l; x <= r; x++) yield { type: 'sorted', index: x };
  }
  function* sort(l: number, r: number): Generator<any, void, any> {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    yield* sort(l, m);
    yield* sort(m + 1, r);
    yield* merge(l, m, r);
  }
  yield* sort(0, arr.length - 1);
  yield { type: 'done' };
};

export const mergeAlgo: Algorithm = {
  id: 'merge',
  name: 'Merge Sort',
  category: 'sort',
  complexity: 'O(n log n)',
  space: 'O(n)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
