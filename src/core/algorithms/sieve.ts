import { Algorithm } from '../types';

const generator = function* sieveSolve(limit = 50) {
  yield { type: 'initSieve', max: limit, log: `Create integer elements grid up to limit ${limit}` };
  
  const primes = Array(limit + 1).fill(true);
  for (let p = 2; p * p <= limit; p++) {
    if (primes[p] === true) {
      yield { type: 'activePrime', prime: p, log: `Discovered prime seed element ${p}`, vars: { activePrime: p } };
      for (let i = p * p; i <= limit; i += p) {
        primes[i] = false;
        yield { type: 'checkMultiple', index: i, multipleOf: p, log: `Eliminate composite multiple ${i}`, vars: { multiple: i, primeFactor: p } };
      }
    }
  }
  
  for (let i = 2; i <= limit; i++) {
    if (primes[i]) yield { type: 'markPrime', index: i };
  }
  yield { type: 'done', log: 'Identified all prime numbers successfully!' };
};

export const sieveAlgo: Algorithm = {
  id: 'sieve',
  name: 'Sieve of Eratosthenes Primes',
  category: 'math',
  complexity: 'O(n log log n)',
  space: 'O(n)',
  visualizer: 'math',
  generator,
  code: generator.toString()
};
