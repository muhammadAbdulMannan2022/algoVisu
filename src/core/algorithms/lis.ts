import { Algorithm } from '../types';

const generator = function* lisSolver(arr: number[]) {
  const n = arr.length;
  const lis = Array(n).fill(1);
  yield { type: 'active', index: 0, log: 'Initialize LIS DP array with 1s', vars: { LIS: JSON.stringify(lis) } };
  
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      yield { type: 'compare', i: j, j: i, log: `Compare element ${arr[j]} at index ${j} with ${arr[i]} at index ${i}`, vars: { LIS: JSON.stringify(lis) } };
      if (arr[i] > arr[j]) {
        if (lis[i] < lis[j] + 1) {
          lis[i] = lis[j] + 1;
          yield { type: 'swap', i: j, j: i, log: `Update LIS at index ${i} to be ${lis[i]}`, vars: { LIS: JSON.stringify(lis) } };
        }
      }
    }
  }
  const max = Math.max(...lis);
  yield { type: 'done', log: `Length of LIS is ${max}`, vars: { maxLIS: max } };
};

export const lisAlgo: Algorithm = {
  id: 'lis',
  name: 'Longest Increasing Subsequence',
  category: 'dp',
  complexity: 'O(n²)',
  space: 'O(n)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
