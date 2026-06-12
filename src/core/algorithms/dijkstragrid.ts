import { Algorithm } from '../types';

const generator = function* dijkstra2D(grid: string[][], start: [number, number], end: [number, number]) {
  const rows = grid.length, cols = grid[0].length;
  const key = (p: [number, number]) => `${p[0]},${p[1]}`;
  
  const dist: Record<string, number> = {};
  const parent: Record<string, [number, number]> = {};
  const visited = new Set<string>();
  const nodesQueue: [number, number][] = [];
  
  for(let r=0; r<rows; r++) {
    for(let c=0; c<cols; c++) {
      dist[key([r, c])] = Infinity;
    }
  }
  dist[key(start)] = 0;
  nodesQueue.push(start);
  
  let found = false;
  
  while(nodesQueue.length > 0) {
    nodesQueue.sort((a, b) => dist[key(a)] - dist[key(b)]);
    const curr = nodesQueue.shift()!;
    const currKey = key(curr);
    
    if (visited.has(currKey)) continue;
    visited.add(currKey);
    
    yield { type: 'visit', r: curr[0], c: curr[1], log: `Visit cell (${curr[0]}, ${curr[1]}) with path cost: ${dist[currKey]}` };
    
    if (curr[0] === end[0] && curr[1] === end[1]) {
      found = true;
      break;
    }
    
    const neighbors: [number, number][] = [
      [curr[0]-1, curr[1]], [curr[0]+1, curr[1]],
      [curr[0], curr[1]-1], [curr[0], curr[1]+1]
    ];
    
    for(const nb of neighbors) {
      const [nr, nc] = nb;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc] === 'wall') continue;
      const nbKey = key(nb);
      
      const weightCost = grid[nr][nc] === 'weight' ? 5 : 1;
      const alt = dist[currKey] + weightCost;
      if (alt < dist[nbKey]) {
        dist[nbKey] = alt;
        parent[nbKey] = curr;
        nodesQueue.push(nb);
        yield { type: 'enqueue', r: nr, c: nc, log: `Update distance cost of (${nr}, ${nc}) to ${alt}` };
      }
    }
  }
  
  if (found) {
    const path: [number, number][] = [];
    let temp = end;
    while(parent[key(temp)]) {
      path.push(temp);
      temp = parent[key(temp)];
    }
    path.push(start);
    path.reverse();
    for(const p of path) yield { type: 'path', r: p[0], c: p[1] };
    yield { type: 'done', log: 'Shortest path found using Dijkstra!' };
  } else {
    yield { type: 'done', log: 'No path exists' };
  }
};

export const dijkstragridAlgo: Algorithm = {
  id: 'dijkstragrid',
  name: 'Dijkstra 2D Grid Path',
  category: 'grid',
  complexity: 'O(E log V)',
  space: 'O(V)',
  visualizer: 'grid',
  generator,
  code: generator.toString()
};
