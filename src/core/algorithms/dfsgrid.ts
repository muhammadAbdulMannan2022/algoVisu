import { Algorithm } from '../types';

const generator = function* dfs2D(grid: string[][], start: [number, number], end: [number, number]) {
  const rows = grid.length, cols = grid[0].length;
  const stack = [start];
  const visited = new Set<string>([`${start[0]},${start[1]}`]);
  const parent: Record<string, [number, number]> = {};
  let found = false;
  
  while(stack.length > 0) {
    const curr = stack.pop()!;
    yield { type: 'visit', r: curr[0], c: curr[1], log: `Visit cell (${curr[0]}, ${curr[1]})` };
    
    if (curr[0] === end[0] && curr[1] === end[1]) {
      found = true;
      break;
    }
    
    const neighbors: [number, number][] = [
      [curr[0]-1, curr[1]], [curr[0]+1, curr[1]],
      [curr[0], curr[1]-1], [curr[0], curr[1]+1]
    ];
    for (const nb of neighbors) {
      const keyStr = `${nb[0]},${nb[1]}`;
      if (nb[0]>=0 && nb[0]<rows && nb[1]>=0 && nb[1]<cols && grid[nb[0]][nb[1]]!=='wall' && !visited.has(keyStr)) {
        visited.add(keyStr);
        parent[keyStr] = curr;
        stack.push(nb);
        yield { type: 'enqueue', r: nb[0], c: nb[1], log: `Queue node cell (${nb[0]}, ${nb[1]})` };
      }
    }
  }
  
  if (found) {
    const path: [number, number][] = [];
    let temp = end;
    while(parent[`${temp[0]},${temp[1]}`]) {
      path.push(temp);
      temp = parent[`${temp[0]},${temp[1]}`];
    }
    path.push(start);
    path.reverse();
    for (const p of path) yield { type: 'path', r: p[0], c: p[1] };
    yield { type: 'done', log: 'DFS Pathfinding complete!' };
  } else {
    yield { type: 'done', log: 'No path exists' };
  }
};

export const dfsgridAlgo: Algorithm = {
  id: 'dfsgrid',
  name: 'DFS 2D Grid Search',
  category: 'grid',
  complexity: 'O(V+E)',
  space: 'O(V)',
  visualizer: 'grid',
  generator,
  code: generator.toString()
};
