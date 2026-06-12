import { Algorithm } from '../types';

const generator = function* gcdSolve(numA = 84, numB = 18) {
  let a = numA, b = numB;
  yield { type: 'active', index: 0, log: `Calculate Greatest Common Divisor of (${a}, ${b})`, vars: { valueA: a, valueB: b } };
  
  while (b !== 0) {
    const temp = b;
    const mod = a % b;
    yield { type: 'compare', i: 0, j: 1, log: `${a} modulo ${b} results in ${mod}`, vars: { a, b, mod } };
    a = b;
    b = mod;
  }
  yield { type: 'done', log: `Greatest Common Divisor is ${a}`, vars: { result: a } };
};

export const gcdAlgo: Algorithm = {
  id: 'gcd',
  name: 'Euclidean Greatest Common Divisor',
  category: 'math',
  complexity: 'O(log(min(a,b)))',
  space: 'O(1)',
  visualizer: 'array',
  generator,
  code: generator.toString()
};
