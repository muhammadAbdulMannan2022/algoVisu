import { Algorithm } from '../types';

const generator = function* heapSort(arr: number[]) {
  const n = arr.length;
  function* heapify(size: number, idx: number): Generator<any, void, any> {
    let largest = idx;
    const l = 2 * idx + 1;
    const r = 2 * idx + 2;
    yield { type: 'compare', i: largest, j: l < size ? l : largest, log: `Checking binary tree left child` };
    if (l < size && arr[l] > arr[largest]) largest = l;
    yield { type: 'compare', i: largest, j: r < size ? r : largest, log: `Checking binary tree right child` };
    if (r < size && arr[r] > arr[largest]) largest = r;
    if (largest !== idx) {
      [arr[idx], arr[largest]] = [arr[largest], arr[idx]];
      yield { type: 'swap', i: idx, j: largest, log: `Bubbling up node value in heap` };
      yield* heapify(size, largest);
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield { type: 'swap', i: 0, j: i, log: `Extract maximum element from heap` };
    yield { type: 'sorted', index: i };
    yield* heapify(i, 0);
  }
  yield { type: 'sorted', index: 0 };
  yield { type: 'done' };
};

export const heapAlgo: Algorithm = {
  id: 'heap',
  name: 'Heap Sort',
  category: 'sort',
  complexity: 'O(n log n)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
