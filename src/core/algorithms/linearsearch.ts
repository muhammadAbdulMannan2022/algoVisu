import { Algorithm } from '../types';

const generator = function* linearSearch(arr: number[]) {
  const target = 55;
  yield { type: 'active', index: 0, log: `Look for target ${target}`, vars: { target } };
  for (let i = 0; i < arr.length; i++) {
    yield { type: 'compare', i, j: i, log: `Compare arr[${i}]=${arr[i]} with target`, vars: { index: i, val: arr[i] } };
    if (arr[i] === target) {
      yield { type: 'sorted', index: i, log: `Target found at index ${i}!` };
      yield { type: 'done' };
      return;
    }
  }
  yield { type: 'done', log: 'Target not found' };
};

export const linearsearchAlgo: Algorithm = {
  id: 'linearsearch',
  name: 'Linear Search',
  category: 'search',
  complexity: 'O(n)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
