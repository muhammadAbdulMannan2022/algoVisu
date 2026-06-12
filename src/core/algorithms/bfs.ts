import { Algorithm, GraphData } from '../types';

const getGraphMock = (): GraphData => {
  return {
    nodes: [
      { id: 0, label: 'A', x: 80, y: 150 },
      { id: 1, label: 'B', x: 200, y: 70 },
      { id: 2, label: 'C', x: 200, y: 230 },
      { id: 3, label: 'D', x: 320, y: 70 },
      { id: 4, label: 'E', x: 320, y: 230 },
      { id: 5, label: 'F', x: 440, y: 150 },
      { id: 6, label: 'G', x: 440, y: 70 },
      { id: 7, label: 'H', x: 540, y: 150 }
    ],
    edges: [
      { u: 0, v: 1, w: 3 }, { u: 0, v: 2, w: 5 },
      { u: 1, v: 2, w: 1 }, { u: 1, v: 3, w: 2 },
      { u: 2, v: 4, w: 4 }, { u: 3, v: 4, w: 2 },
      { u: 3, v: 6, w: 3 }, { u: 4, v: 5, w: 1 },
      { u: 5, v: 6, w: 2 }, { u: 5, v: 7, w: 3 },
      { u: 6, v: 7, w: 2 }
    ]
  };
};

const generator = function* graphBFS(graph?: GraphData, startNodeId = 0) {
  const g = graph && graph.nodes.length > 0 ? graph : getGraphMock();
  yield { type: 'initGraph', nodes: g.nodes, edges: g.edges, log: 'Initialize Adjacency Graph sets' };
  
  // Find start node index
  const startNode = g.nodes.find(n => n.id === startNodeId);
  if (startNode?.isObstacle) {
    yield { type: 'done', log: `Start node ${startNode.label} is an obstacle and cannot be visited!` };
    return;
  }

  const queue = [startNodeId];
  const visited = new Set<number>([startNodeId]);
  const startLabel = startNode?.label || String(startNodeId);
  yield { type: 'activeNode', node: startNodeId, log: `Enqueue start vertex ${startLabel}`, vars: { queue: startLabel, visited: startLabel } };
  
  while(queue.length > 0) {
    const curr = queue.shift()!;
    const currNode = g.nodes.find(n => n.id === curr);
    if (!currNode) continue;
    const label = currNode.label;
    yield { type: 'visitedNode', node: curr, log: `Dequeue vertex ${label}`, vars: { current: label, queue: queue.map(n => g.nodes.find(node => node.id === n)?.label || String(n)).join(',') } };
    
    // Find adjacent nodes
    const neighbors = g.edges
      .filter(e => e.u === curr || e.v === curr)
      .map(e => (e.u === curr ? e.v : e.u));
      
    for (const nb of neighbors) {
      const nbNode = g.nodes.find(n => n.id === nb);
      if (!nbNode) continue;
      
      if (nbNode.isObstacle) {
        yield { type: 'activeNode', node: nb, log: `Skip neighbor vertex ${nbNode.label} (Blocked by obstacle)` };
        continue;
      }
      
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
        yield { type: 'traverseEdge', u: curr, v: nb, log: `Traverse edge from ${label} to ${nbNode.label}` };
        yield { type: 'activeNode', node: nb, log: `Enqueue unvisited neighbor ${nbNode.label}`, vars: { queue: queue.map(n => g.nodes.find(node => node.id === n)?.label || String(n)).join(','), visited: Array.from(visited).map(n=>g.nodes.find(node => node.id === n)?.label || String(n)).join(',') } };
      }
    }
  }
  yield { type: 'done', log: 'Breadth-First search traversal completed!' };
};

export const bfsAlgo: Algorithm = {
  id: 'bfs',
  name: 'Breadth-First Search (BFS)',
  category: 'graph',
  complexity: 'O(V+E)',
  space: 'O(V)',
  visualizer: 'graph',
  generator,
  code: generator.toString()
};
