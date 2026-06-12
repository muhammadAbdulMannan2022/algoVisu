import { Algorithm } from '../types';

const generator = function* binarySearch(arr: number[]) {
  const target = 55;
  let low = 0, high = arr.length - 1;
  yield { type: 'active', index: 0, log: `Requires sorted array. Search for ${target}` };
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    yield { type: 'compare', i: low, j: high, log: `Active search space: bounds [${low}, ${high}]`, vars: { low, high, mid, midVal: arr[mid] } };
    yield { type: 'pivot', index: mid, log: `Calculated middle point index ${mid}` };
    if (arr[mid] === target) {
      yield { type: 'sorted', index: mid, log: `Found target at index ${mid}!` };
      yield { type: 'done' };
      return;
    }
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  yield { type: 'done', log: 'Target not found' };
};

export const binarysearchAlgo: Algorithm = {
  id: 'binarysearch',
  name: 'Binary Search',
  category: 'search',
  complexity: 'O(log n)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
