import { Algorithm } from '../types';

const generator = function* kadane(arr: number[]) {
  let maxSoFar = arr[0], maxEndingHere = arr[0];
  yield { type: 'active', index: 0, log: `Initialize dynamic maximum ending here at start` };
  for (let i = 1; i < arr.length; i++) {
    yield { type: 'compare', i, j: i, log: `Evaluating element ${arr[i]}`, vars: { i, maxSoFar, maxEndingHere } };
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
    yield { type: 'swap', i, j: i, log: `Current contiguous maximum ending here is ${maxEndingHere}` };
  }
  yield { type: 'done', log: `Maximum Subarray Sum discovered is ${maxSoFar}` };
};

export const kadaneAlgo: Algorithm = {
  id: 'kadane',
  name: 'Kadane\'s Subarray Sum',
  category: 'search',
  complexity: 'O(n)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
