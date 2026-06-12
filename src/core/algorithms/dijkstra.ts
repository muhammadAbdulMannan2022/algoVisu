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

const generator = function* graphDijkstra(graph?: GraphData, startNodeId = 0, targetNodeId = 7) {
  const g = graph && graph.nodes.length > 0 ? graph : getGraphMock();
  yield { type: 'initGraph', nodes: g.nodes, edges: g.edges, log: 'Initialize weighted adjacency graph' };
  
  const startNode = g.nodes.find(n => n.id === startNodeId);
  const targetNode = g.nodes.find(n => n.id === targetNodeId);
  
  if (startNode?.isObstacle) {
    yield { type: 'done', log: `Start node ${startNode.label} is blocked by an obstacle!` };
    return;
  }
  
  const dist: Record<number, number> = {};
  const prev: Record<number, number> = {};
  const unvisited = new Set<number>();
  
  g.nodes.forEach(n => {
    dist[n.id] = Infinity;
    if (!n.isObstacle) {
      unvisited.add(n.id);
    }
  });
  
  if (dist[startNodeId] !== undefined) {
    dist[startNodeId] = 0;
  }
  
  const startLabel = startNode?.label || String(startNodeId);
  yield { type: 'activeNode', node: startNodeId, log: `Set source node ${startLabel} distance to 0`, vars: { distances: JSON.stringify(dist) } };
  
  let reachedTarget = false;
  
  while(unvisited.size > 0) {
    // Extract min distance node
    let minNodeId: number | null = null;
    let minDist = Infinity;
    unvisited.forEach(nodeId => {
      if (dist[nodeId] < minDist) {
        minDist = dist[nodeId];
        minNodeId = nodeId;
      }
    });
    
    if (minNodeId === null || minDist === Infinity) break;
    
    const u = minNodeId as number;
    unvisited.delete(u);
    
    const uNode = g.nodes.find(n => n.id === u);
    if (!uNode) continue;
    
    yield { type: 'visitedNode', node: u, log: `Visit closest node ${uNode.label} (Dist: ${dist[u]})`, vars: { current: uNode.label, distances: JSON.stringify(dist) } };
    
    if (u === targetNodeId) {
      reachedTarget = true;
      yield { type: 'activeNode', node: targetNodeId, log: `Target node ${uNode.label} reached!` };
      break;
    }
    
    const edges = g.edges.filter(e => e.u === u || e.v === u);
    for (const edge of edges) {
      const v = edge.u === u ? edge.v : edge.u;
      if (!unvisited.has(v)) continue;
      
      const vNode = g.nodes.find(n => n.id === v);
      if (!vNode || vNode.isObstacle) continue;
      
      yield { type: 'traverseEdge', u, v, log: `Evaluate neighbor ${vNode.label}` };
      
      const alt = dist[u] + (edge.w || 1);
      yield { type: 'compareNode', node: v, log: `Compare current dist ${dist[v]} with alternative path ${alt}`, vars: { u: uNode.label, v: vNode.label, edgeCost: edge.w } };
      
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        yield { type: 'activeNode', node: v, log: `Update node ${vNode.label} distance to ${alt}`, vars: { distances: JSON.stringify(dist) } };
      }
    }
  }
  
  if (reachedTarget) {
    let temp = targetNodeId;
    const pathNodes = [targetNodeId];
    while (prev[temp] !== undefined) {
      pathNodes.push(prev[temp]);
      temp = prev[temp];
    }
    pathNodes.reverse();
    const targetLabel = targetNode?.label || String(targetNodeId);
    yield { type: 'done', log: `Optimal Path to ${targetLabel} found: ${pathNodes.map(n => g.nodes.find(node => node.id === n)?.label || String(n)).join(' -> ')} (Cost: ${dist[targetNodeId]})` };
  } else {
    yield { type: 'done', log: `No path exists to target node ${targetNode?.label || targetNodeId}.` };
  }
};

export const dijkstraAlgo: Algorithm = {
  id: 'dijkstra',
  name: 'Dijkstra\'s Shortest Path',
  category: 'graph',
  complexity: 'O(E + V log V)',
  space: 'O(V)',
  visualizer: 'graph',
  generator,
  code: generator.toString()
};
