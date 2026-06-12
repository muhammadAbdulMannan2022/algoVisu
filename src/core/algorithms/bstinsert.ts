import { Algorithm, GraphData } from '../types';

const getTreeMock = (): GraphData => {
  return {
    nodes: [
      { id: 1, label: '50', x: 250, y: 50 },
      { id: 2, label: '30', x: 150, y: 110 },
      { id: 3, label: '70', x: 350, y: 110 },
      { id: 4, label: '20', x: 100, y: 170 },
      { id: 5, label: '40', x: 200, y: 170 },
      { id: 6, label: '60', x: 300, y: 170 },
      { id: 7, label: '80', x: 400, y: 170 },
      { id: 8, label: '10', x: 70, y: 230 },
      { id: 9, label: '25', x: 130, y: 230 }
    ],
    edges: [
      { u: 1, v: 2 }, { u: 1, v: 3 },
      { u: 2, v: 4 }, { u: 2, v: 5 },
      { u: 3, v: 6 }, { u: 3, v: 7 },
      { u: 4, v: 8 }, { u: 4, v: 9 }
    ]
  };
};

const generator = function* bstInsertion(graph?: GraphData, insertVal = 45) {
  const g = graph && graph.nodes.length > 0 ? graph : getTreeMock();
  const nodes = JSON.parse(JSON.stringify(g.nodes));
  const edges = JSON.parse(JSON.stringify(g.edges));
  
  yield { type: 'initGraph', nodes, edges, log: `Create initial Binary Search Tree (Target insertion value: ${insertVal})` };
  
  let currId = 1;
  let prevId = 1;
  let dir = '';
  
  while (currId) {
    const nodeObj = nodes.find((n: any) => n.id === currId);
    if (!nodeObj) break;
    
    if (nodeObj.isObstacle) {
      yield { type: 'activeNode', node: currId, log: `BST search path blocked at obstacle node ${nodeObj.label}!` };
      yield { type: 'done', log: 'BST insertion aborted due to obstacle block.' };
      return;
    }
    
    const nodeVal = parseInt(nodeObj.label, 10);
    prevId = currId;
    
    if (insertVal < nodeVal) {
      yield { type: 'compareNode', node: currId, log: `Compare node ${nodeObj.label} with target ${insertVal}`, vars: { insertVal, comp: `${insertVal} < ${nodeVal} (Go Left)` } };
      const leftEdge = edges.find((e: any) => e.u === currId && nodes.find((n: any) => n.id === e.v) && nodes.find((n: any) => n.id === e.v).x < nodeObj.x);
      if (leftEdge) {
        yield { type: 'traverseEdge', u: currId, v: leftEdge.v };
        currId = leftEdge.v;
      } else {
        dir = 'left';
        break;
      }
    } else {
      yield { type: 'compareNode', node: currId, log: `Compare node ${nodeObj.label} with target ${insertVal}`, vars: { insertVal, comp: `${insertVal} >= ${nodeVal} (Go Right)` } };
      const rightEdge = edges.find((e: any) => e.u === currId && nodes.find((n: any) => n.id === e.v) && nodes.find((n: any) => n.id === e.v).x > nodeObj.x);
      if (rightEdge) {
        yield { type: 'traverseEdge', u: currId, v: rightEdge.v };
        currId = rightEdge.v;
      } else {
        dir = 'right';
        break;
      }
    }
  }
  
  const parentNode = nodes.find((n: any) => n.id === prevId);
  if (parentNode) {
    const newId = Math.max(...nodes.map((n: any) => n.id)) + 1;
    const offsetMultiplier = dir === 'left' ? -1 : 1;
    const newX = parentNode.x + offsetMultiplier * 35;
    const newY = parentNode.y + 60;
    
    nodes.push({ id: newId, label: `${insertVal} (New)`, x: newX, y: newY });
    edges.push({ u: prevId, v: newId });
    
    yield { type: 'initGraph', nodes, edges, log: `Linked new leaf node ${insertVal} dynamically as ${dir} child of ${parentNode.label}!` };
    yield { type: 'visitedNode', node: newId, log: `Node ${insertVal} successfully inserted.` };
  }
  yield { type: 'done' };
};

export const bstinsertAlgo: Algorithm = {
  id: 'bstinsert',
  name: 'BST: Node Insertion',
  category: 'graph',
  complexity: 'O(log n)',
  space: 'O(n)',
  visualizer: 'graph',
  generator,
  code: generator.toString()
};
