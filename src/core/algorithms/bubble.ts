import { Algorithm } from '../types';

const generator = function* bubbleSort(arr: number[]) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', i: j, j: j + 1, log: `Compare indices ${j} & ${j+1}`, vars: { i, j, valI: arr[j], valJ: arr[j+1] } };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { type: 'swap', i: j, j: j + 1, log: `Swap elements at ${j} & ${j+1}` };
        swapped = true;
      }
    }
    yield { type: 'sorted', index: n - i - 1, log: `Index ${n-i-1} is in final position` };
    if (!swapped) break;
  }
  yield { type: 'done', log: 'Array is fully sorted!' };
};

export const bubbleAlgo: Algorithm = {
  id: 'bubble',
  name: 'Bubble Sort',
  category: 'sort',
  complexity: 'O(n²)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
