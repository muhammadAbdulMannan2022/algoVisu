import { Algorithm } from '../types';

const generator = function* conwayLife(grid: string[][]) {
  const rows = grid.length, cols = grid[0].length;
  let activeGrid = grid.map(row => row.map(() => Math.random() > 0.7 ? 1 : 0));
  
  for (let gen = 0; gen < 25; gen++) {
    const nextGrid = activeGrid.map(r => [...r]);
    let changes = 0;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let live = 0;
        for (let dr of [-1, 0, 1]) {
          for (let dc of [-1, 0, 1]) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && activeGrid[nr][nc] === 1) {
              live++;
            }
          }
        }
        if (activeGrid[r][c] === 1) {
          nextGrid[r][c] = (live === 2 || live === 3) ? 1 : 0;
        } else {
          nextGrid[r][c] = (live === 3) ? 1 : 0;
        }
        if (nextGrid[r][c] !== activeGrid[r][c]) changes++;
      }
    }
    if (changes === 0) break;
    activeGrid = nextGrid;
    
    // Map numerical grid back into string cell weights/empty to visualize on grid canvas
    const stringGrid = activeGrid.map(row => row.map(cell => cell === 1 ? 'weight' : 'empty'));
    yield { type: 'cellularUpdate', grid: stringGrid, log: `Generations computed: ${gen}`, vars: { generation: gen, alive: activeGrid.flat().filter(Boolean).length } };
  }
  yield { type: 'done' };
};

export const gameoflifeAlgo: Algorithm = {
  id: 'gameoflife',
  name: 'Conway\'s Game of Life',
  category: 'grid',
  complexity: 'O(gen · R · C)',
  space: 'O(RC)',
  visualizer: 'grid',
  generator,
  code: generator.toString()
};
