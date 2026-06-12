import { Algorithm } from '../types';

const generator = function* hanoiSolve(numDisks = 4) {
  yield { type: 'initHanoi', disks: numDisks, log: `Initialize 3 pegs with ${numDisks} graded disks` };
  
  function* moveDisk(n: number, from: number, to: number, aux: number): Generator<any, void, any> {
    if (n === 1) {
      yield { type: 'moveDisk', from, to, log: `Move disk 1 from Peg ${from} to Peg ${to}`, vars: { diskSize: 1, source: from, target: to } };
      return;
    }
    yield* moveDisk(n - 1, from, aux, to);
    yield { type: 'moveDisk', from, to, log: `Move disk ${n} from Peg ${from} to Peg ${to}`, vars: { diskSize: n, source: from, target: to } };
    yield* moveDisk(n - 1, aux, to, from);
  }
  yield* moveDisk(numDisks, 0, 2, 1);
  yield { type: 'done' };
};

export const hanoiAlgo: Algorithm = {
  id: 'hanoi',
  name: 'Tower of Hanoi Disk Solver',
  category: 'math',
  complexity: 'O(2ⁿ)',
  space: 'O(n)',
  visualizer: 'math',
  generator,
  code: generator.toString()
};
