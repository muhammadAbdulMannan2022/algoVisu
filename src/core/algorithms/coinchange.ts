import { Algorithm } from '../types';

const generator = function* coinChangeSolver(arr: number[], amount = 12) {
  // Use array inputs as denominations. E.g. [1, 2, 5]
  const coins = arr.filter(x => x > 0).slice(0, 4); // Keep at most 4 coins to fit viz
  
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  const dpViz = [...dp];
  dpViz[0] = 0;
  
  yield { type: 'active', index: 0, log: `Solve coin change for amount ${amount} using coins: [${coins.join(', ')}]`, vars: { dp: JSON.stringify(dpViz) } };
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i >= coin) {
        yield { type: 'compare', i: i - coin, j: i, log: `Check subproblem dp[${i - coin}] for coin ${coin}`, vars: { dp: JSON.stringify(dpViz) } };
        if (dp[i - coin] !== Infinity && dp[i - coin] + 1 < dp[i]) {
          dp[i] = dp[i - coin] + 1;
          dpViz[i] = dp[i];
          yield { type: 'swap', i, j: i, log: `Update dp[${i}] to be dp[${i - coin}] + 1 = ${dp[i]}`, vars: { dp: JSON.stringify(dpViz) } };
        }
      }
    }
  }
  const result = dp[amount] === Infinity ? -1 : dp[amount];
  yield { type: 'done', log: `Minimum coins needed for ${amount} is ${result}`, vars: { result } };
};

export const coinchangeAlgo: Algorithm = {
  id: 'coinchange',
  name: 'Coin Change Problem (Min Coins)',
  category: 'dp',
  complexity: 'O(nc)',
  space: 'O(c)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
