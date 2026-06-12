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

const generator = function* graphDFS(graph?: GraphData, startNodeId = 0) {
  const g = graph && graph.nodes.length > 0 ? graph : getGraphMock();
  yield { type: 'initGraph', nodes: g.nodes, edges: g.edges, log: 'Initialize Adjacency Graph sets' };
  
  const startNode = g.nodes.find(n => n.id === startNodeId);
  if (startNode?.isObstacle) {
    yield { type: 'done', log: `Start node ${startNode.label} is an obstacle and cannot be visited!` };
    return;
  }

  const visited = new Set<number>();
  const path = [] as string[];
  
  function* dfsVisit(nodeId: number): Generator<any, void, any> {
    const nodeObj = g.nodes.find(n => n.id === nodeId);
    if (!nodeObj) return;
    
    visited.add(nodeId);
    path.push(nodeObj.label);
    yield { type: 'visitedNode', node: nodeId, log: `Visit node ${nodeObj.label}`, vars: { path: path.join(' -> '), visited: Array.from(visited).map(n => g.nodes.find(node => node.id === n)?.label || String(n)).join(',') } };
    
    const neighbors = g.edges
      .filter(e => e.u === nodeId || e.v === nodeId)
      .map(e => (e.u === nodeId ? e.v : e.u));
      
    for (const nb of neighbors) {
      const nbNode = g.nodes.find(n => n.id === nb);
      if (!nbNode) continue;
      
      if (nbNode.isObstacle) {
        yield { type: 'activeNode', node: nb, log: `Skip neighbor vertex ${nbNode.label} (Blocked by obstacle)` };
        continue;
      }
      
      if (!visited.has(nb)) {
        yield { type: 'traverseEdge', u: nodeId, v: nb, log: `Traverse edge from ${nodeObj.label} to ${nbNode.label}` };
        yield* dfsVisit(nb);
        yield { type: 'activeNode', node: nodeId, log: `Backtrack to node ${nodeObj.label}` };
      }
    }
  }
  
  yield* dfsVisit(startNodeId);
  yield { type: 'done', log: 'DFS Traversal completed!' };
};

export const dfsAlgo: Algorithm = {
  id: 'dfs',
  name: 'Depth-First Search (DFS)',
  category: 'graph',
  complexity: 'O(V+E)',
  space: 'O(V)',
  visualizer: 'graph',
  generator,
  code: generator.toString()
};
