import { Algorithm } from '../types';

const generator = function* twoSum(arr: number[]) {
  const target = 77;
  yield { type: 'active', index: 0, log: `Find two elements summing up to target ${target}`, vars: { target } };
  const seen: Record<number, number> = {};
  for (let i = 0; i < arr.length; i++) {
    const diff = target - arr[i];
    yield { type: 'compare', i, j: i, log: `Checking complement ${diff} for arr[${i}]=${arr[i]}`, vars: { i, val: arr[i], lookingFor: diff } };
    if (seen[diff] !== undefined) {
      yield { type: 'sorted', index: seen[diff] };
      yield { type: 'sorted', index: i, log: `Found pair! indices ${seen[diff]} & ${i}` };
      yield { type: 'done' };
      return;
    }
    seen[arr[i]] = i;
  }
  yield { type: 'done', log: 'No pair exists.' };
};

export const twosumAlgo: Algorithm = {
  id: 'twosum',
  name: 'Two Sum Problem',
  category: 'search',
  complexity: 'O(n)',
  space: 'O(n)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
