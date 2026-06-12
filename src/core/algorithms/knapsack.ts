import { Algorithm } from '../types';

const generator = function* knapsackSolver(weights = [2, 3, 4, 5], values = [3, 4, 5, 6], W = 5) {
  const n = weights.length;
  
  const rows = ["Row:0", ...Array.from({ length: n }, (_, i) => `Item:${i + 1}`)];
  const cols = Array.from({ length: W + 1 }, (_, i) => `Cap:${i}`);
  
  yield { type: 'initMatrix', rows, cols, log: 'Initialize DP table: items vs knapsack capacity', vars: { capacity: W, numItems: n } };
  
  const dp = Array.from({length: n + 1}, () => Array(W + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      yield { type: 'cellUpdate', r: i, c: w, val: dp[i-1][w], state: 'compare', log: `Evaluate item ${i} for capacity ${w}`, vars: { itemWeight: weights[i-1], itemVal: values[i-1] } };
      
      if (weights[i-1] <= w) {
        const include = values[i-1] + dp[i-1][w - weights[i-1]];
        const exclude = dp[i-1][w];
        dp[i][w] = Math.max(include, exclude);
      } else {
        dp[i][w] = dp[i-1][w];
      }
      yield { type: 'cellUpdate', r: i, c: w, val: dp[i][w], state: 'solved' };
    }
  }
  yield { type: 'done', log: `Optimal Knapsack value is ${dp[n][W]}` };
};

export const knapsackAlgo: Algorithm = {
  id: 'knapsack',
  name: '0/1 Knapsack Problem',
  category: 'dp',
  complexity: 'O(nW)',
  space: 'O(nW)',
  visualizer: 'matrix',
  generator,
  code: generator.toString()
};
