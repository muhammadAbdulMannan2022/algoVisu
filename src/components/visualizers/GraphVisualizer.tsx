'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AlgoStep, GraphData, GraphNode } from '../../core/types';

interface GraphVisualizerProps {
  graph: GraphData;
  step: AlgoStep;
  onGraphChange: (updatedGraph: GraphData) => void;
}

export default function GraphVisualizer({ graph, step, onGraphChange }: GraphVisualizerProps) {
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: number) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
  };

  const handleNodeDoubleClick = (e: React.MouseEvent, nodeId: number) => {
    e.stopPropagation();
    const updatedNodes = nodes.map((node) =>
      node.id === nodeId ? { ...node, isObstacle: !node.isObstacle } : node
    );
    onGraphChange({
      ...graph,
      nodes: updatedNodes,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId === null || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Boundary constraints checks
    const targetX = Math.max(20, Math.min(rect.width - 20, x));
    const targetY = Math.max(20, Math.min(rect.height - 20, y));

    const updatedNodes = nodes.map((node) =>
      node.id === draggedNodeId ? { ...node, x: targetX, y: targetY } : node
    );

    onGraphChange({
      ...graph,
      nodes: updatedNodes,
    });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDraggedNodeId(null);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div id="viz-graph" className="viz-canvas active">
      <svg
        id="graph-svg"
        ref={svgRef}
        onMouseMove={handleMouseMove}
        style={{ cursor: draggedNodeId !== null ? 'grabbing' : 'grab' }}
      >
        {/* Draw Edges */}
        {edges.map((edge, idx) => {
          const uNode = nodes.find((n) => n.id === edge.u);
          const vNode = nodes.find((n) => n.id === edge.v);
          if (!uNode || !vNode) return null;

          const isActiveEdge =
            step.type === 'traverseEdge' &&
            ((step.u === edge.u && step.v === edge.v) ||
              (step.u === edge.v && step.v === edge.u));

          // Draw mid point for weight rendering
          const mx = (uNode.x + vNode.x) / 2;
          const my = (uNode.y + vNode.y) / 2;

          return (
            <g key={`edge-${idx}`}>
              <line
                x1={uNode.x}
                y1={uNode.y}
                x2={vNode.x}
                y2={vNode.y}
                className={`graph-edge ${isActiveEdge ? 'active' : ''}`}
              />
              {edge.w !== undefined && (
                <text x={mx} y={my - 4} className="edge-weight-text">
                  {edge.w}
                </text>
              )}
            </g>
          );
        })}

        {/* Draw Nodes */}
        {nodes.map((node) => {
          const isNodeActive = step.type === 'activeNode' && step.node === node.id;
          const isNodeCompare = step.type === 'compareNode' && step.node === node.id;
          const isNodeVisited = step.type === 'visitedNode' && step.node === node.id;

          let nodeClass = '';
          if (node.isObstacle) {
            nodeClass = 'obstacle';
          } else if (isNodeActive) {
            nodeClass = 'active';
          } else if (isNodeCompare) {
            nodeClass = 'compare';
          } else if (isNodeVisited) {
            nodeClass = 'visited';
          }

          return (
            <g
              key={`node-${node.id}`}
              style={{ cursor: 'grab' }}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onDoubleClick={(e) => handleNodeDoubleClick(e, node.id)}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                className={`graph-node-circle ${nodeClass}`}
              />
              <text x={node.x} y={node.y} className="graph-node-text">
                {node.label}
              </text>
              {node.isObstacle && (
                <path
                  d={`M ${node.x - 14} ${node.y - 14} L ${node.x + 14} ${node.y + 14} M ${node.x + 14} ${node.y - 14} L ${node.x - 14} ${node.y + 14}`}
                  stroke="var(--neon-pink)"
                  strokeWidth="2.5"
                  opacity="0.85"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
