import { Algorithm } from '../types';

const generator = function* dutchFlag(arr: number[]) {
  const n = arr.length;
  const categories = arr.map(x => x % 3);
  for(let x=0; x<n; x++) arr[x] = categories[x];
  
  let low = 0, mid = 0, high = n - 1;
  yield { type: 'active', index: 0, log: 'Sort 0s, 1s and 2s in-place', vars: { low, mid, high } };
  while (mid <= high) {
    yield { type: 'compare', i: mid, j: high, vars: { low, mid, high } };
    if (arr[mid] === 0) {
      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      yield { type: 'swap', i: low, j: mid, log: `Found 0! Swap low & mid` };
      low++; mid++;
    } else if (arr[mid] === 1) {
      mid++;
    } else {
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      yield { type: 'swap', i: mid, j: high, log: `Found 2! Swap mid & high` };
      high--;
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted', index: i };
  yield { type: 'done' };
};

export const dutchflagAlgo: Algorithm = {
  id: 'dutchflag',
  name: 'Dutch National Flag',
  category: 'search',
  complexity: 'O(n)',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
