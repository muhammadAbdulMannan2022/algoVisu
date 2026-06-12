import { Algorithm, GraphData } from '../types';

const getTreeMock = (): GraphData => {
  const nodes = [
    { id: 1, label: '50 (Root)', x: 250, y: 50 },
    { id: 2, label: '30', x: 150, y: 110 },
    { id: 3, label: '70', x: 350, y: 110 },
    { id: 4, label: '20', x: 100, y: 170 },
    { id: 5, label: '40', x: 200, y: 170 },
    { id: 6, label: '60', x: 300, y: 170 },
    { id: 7, label: '80', x: 400, y: 170 },
    { id: 8, label: '10', x: 70, y: 230 },
    { id: 9, label: '25', x: 130, y: 230 }
  ];
  const edges = [
    { u: 1, v: 2 }, { u: 1, v: 3 },
    { u: 2, v: 4 }, { u: 2, v: 5 },
    { u: 3, v: 6 }, { u: 3, v: 7 },
    { u: 4, v: 8 }, { u: 4, v: 9 }
  ];
  return { nodes, edges };
};

const generator = function* postorderWalk(graph?: GraphData) {
  const tree = graph && graph.nodes.length > 0 ? graph : getTreeMock();
  yield { type: 'initGraph', nodes: tree.nodes, edges: tree.edges, log: 'Initialize tree structure' };
  
  const path = [] as string[];
  
  function* traverse(nodeId: number): Generator<any, void, any> {
    if (!nodeId) return;
    
    const nodeObj = tree.nodes.find(n => n.id === nodeId);
    if (!nodeObj) return;
    if (nodeObj.isObstacle) {
      yield { type: 'activeNode', node: nodeId, log: `Node ${nodeObj.label} is blocked by an obstacle! Skipping subtree.` };
      return;
    }
    
    yield { type: 'activeNode', node: nodeId, log: `Enter subtree at ${nodeObj.label}` };
    
    const leftEdge = tree.edges.find(e => e.u === nodeId && tree.nodes.find(n => n.id === e.v) && tree.nodes.find(n => n.id === e.v)!.x < nodeObj.x);
    const leftChild = leftEdge?.v;
    if (leftChild) {
      yield { type: 'traverseEdge', u: nodeId, v: leftChild, log: `Go left from ${nodeObj.label} to ${tree.nodes.find(n => n.id === leftChild)?.label || leftChild}` };
      yield* traverse(leftChild);
    }
    
    const rightEdge = tree.edges.find(e => e.u === nodeId && tree.nodes.find(n => n.id === e.v) && tree.nodes.find(n => n.id === e.v)!.x > nodeObj.x);
    const rightChild = rightEdge?.v;
    if (rightChild) {
      yield { type: 'traverseEdge', u: nodeId, v: rightChild, log: `Go right from ${nodeObj.label} to ${tree.nodes.find(n => n.id === rightChild)?.label || rightChild}` };
      yield* traverse(rightChild);
    }
    
    path.push(nodeObj.label.split(' ')[0]);
    yield { type: 'visitedNode', node: nodeId, log: `Log node ${nodeObj.label} value (Post-order visit)`, vars: { traversed: path.join(' -> ') } };
  }
  
  yield* traverse(1);
  yield { type: 'done', log: `Postorder walk completed: ${path.join(' -> ')}` };
};

export const postorderAlgo: Algorithm = {
  id: 'postorder',
  name: 'Binary Tree Postorder Traversal',
  category: 'graph',
  complexity: 'O(n)',
  space: 'O(h)',
  visualizer: 'graph',
  generator,
  code: generator.toString()
};
