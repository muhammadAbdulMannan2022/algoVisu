import { Algorithm } from '../types';

const generator = function* aStarGrid(grid: string[][], start: [number, number], end: [number, number]) {
  const rows = grid.length, cols = grid[0].length;
  const openSet = [start];
  const closedSet = new Set<string>();
  const parent: Record<string, [number, number]> = {};
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const key = (p: [number, number]) => `${p[0]},${p[1]}`;
  const h = (p: [number, number]) => Math.abs(p[0] - end[0]) + Math.abs(p[1] - end[1]);
  
  gScore[key(start)] = 0;
  fScore[key(start)] = h(start);
  
  yield { type: 'active', r: start[0], c: start[1], log: 'Queue starting node coordinate' };
  
  while(openSet.length > 0) {
    openSet.sort((a, b) => fScore[key(a)] - fScore[key(b)]);
    const curr = openSet.shift()!;
    
    if (curr[0] === end[0] && curr[1] === end[1]) {
      const path: [number, number][] = [];
      let temp = curr;
      while(parent[key(temp)]) {
        path.push(temp);
        temp = parent[key(temp)];
      }
      path.push(start);
      path.reverse();
      for (const p of path) {
        yield { type: 'path', r: p[0], c: p[1], log: 'Backtrace optimal node path' };
      }
      yield { type: 'done', log: 'Shortest path found!' };
      return;
    }
    
    closedSet.add(key(curr));
    yield { type: 'visit', r: curr[0], c: curr[1], log: `Visit node cell (${curr[0]}, ${curr[1]})`, vars: { openCount: openSet.length } };
    
    const neighbors: [number, number][] = [
      [curr[0]-1, curr[1]], [curr[0]+1, curr[1]],
      [curr[0], curr[1]-1], [curr[0], curr[1]+1]
    ];
    
    for (const nb of neighbors) {
      const [nr, nc] = nb;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc] === 'wall') continue;
      if (closedSet.has(key(nb))) continue;
      
      const tempG = gScore[key(curr)] + (grid[nr][nc] === 'weight' ? 5 : 1);
      if (gScore[key(nb)] === undefined || tempG < gScore[key(nb)]) {
        parent[key(nb)] = curr;
        gScore[key(nb)] = tempG;
        fScore[key(nb)] = tempG + h(nb);
        
        if (!openSet.some(p => p[0] === nr && p[1] === nc)) {
          openSet.push(nb);
          yield { type: 'enqueue', r: nr, c: nc, log: 'Queue adjacent frontier node' };
        }
      }
    }
  }
  yield { type: 'done', log: 'Finished search. No valid path exists.' };
};

export const astarAlgo: Algorithm = {
  id: 'astar',
  name: 'A* Pathfinding',
  category: 'grid',
  complexity: 'O(E log V)',
  space: 'O(V)',
  visualizer: 'grid',
  generator,
  code: generator.toString()
};
