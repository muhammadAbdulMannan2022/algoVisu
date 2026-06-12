'use client';

import React, { useState, useEffect } from 'react';
import { AlgoStep } from '../../core/types';

interface GridVisualizerProps {
  grid: string[][]; // holds 'empty', 'wall', 'weight'
  step: AlgoStep;
  startNode: [number, number];
  endNode: [number, number];
  onGridStateChange: (newGrid: string[][]) => void;
  onStartNodeChange: (coords: [number, number]) => void;
  onEndNodeChange: (coords: [number, number]) => void;
  onInteractionEnd: () => void;
}

type DragMode = 'none' | 'start' | 'end' | 'wall' | 'weight' | 'clear-wall' | 'clear-weight';

export default function GridVisualizer({
  grid,
  step,
  startNode,
  endNode,
  onGridStateChange,
  onStartNodeChange,
  onEndNodeChange,
  onInteractionEnd,
}: GridVisualizerProps) {
  const [dragMode, setDragMode] = useState<DragMode>('none');

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  // Build a lookup table of the search path / frontiers from step.gridState
  const cellTypeMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    if (step && step.gridState) {
      step.gridState.forEach((st) => {
        const key = `${st.r},${st.c}`;
        // Visited / Path node highlight priority
        map[key] = st.type;
      });
    }
    return map;
  }, [step]);

  const handleCellMouseDown = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();

    if (r === startNode[0] && c === startNode[1]) {
      setDragMode('start');
    } else if (r === endNode[0] && c === endNode[1]) {
      setDragMode('end');
    } else {
      if (e.shiftKey) {
        const currentIsWeight = grid[r][c] === 'weight';
        const nextMode = currentIsWeight ? 'clear-weight' : 'weight';
        setDragMode(nextMode);
        updateCell(r, c, currentIsWeight ? 'empty' : 'weight');
      } else {
        const currentIsWall = grid[r][c] === 'wall';
        const nextMode = currentIsWall ? 'clear-wall' : 'wall';
        setDragMode(nextMode);
        updateCell(r, c, currentIsWall ? 'empty' : 'wall');
      }
    }
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (dragMode === 'none') return;

    if (dragMode === 'start') {
      if (grid[r][c] !== 'wall' && !(r === endNode[0] && c === endNode[1])) {
        onStartNodeChange([r, c]);
      }
    } else if (dragMode === 'end') {
      if (grid[r][c] !== 'wall' && !(r === startNode[0] && c === startNode[1])) {
        onEndNodeChange([r, c]);
      }
    } else if (dragMode === 'wall') {
      if (!(r === startNode[0] && c === startNode[1]) && !(r === endNode[0] && c === endNode[1])) {
        updateCell(r, c, 'wall');
      }
    } else if (dragMode === 'clear-wall') {
      if (grid[r][c] === 'wall') {
        updateCell(r, c, 'empty');
      }
    } else if (dragMode === 'weight') {
      if (!(r === startNode[0] && c === startNode[1]) && !(r === endNode[0] && c === endNode[1])) {
        updateCell(r, c, 'weight');
      }
    } else if (dragMode === 'clear-weight') {
      if (grid[r][c] === 'weight') {
        updateCell(r, c, 'empty');
      }
    }
  };

  const updateCell = (r: number, c: number, value: string) => {
    const updated = grid.map((rowArr, ri) =>
      rowArr.map((cellVal, ci) => (ri === r && ci === c ? value : cellVal))
    );
    onGridStateChange(updated);
  };

  // Add global mouse up listener to clear drag state
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (dragMode !== 'none') {
        setDragMode('none');
        onInteractionEnd();
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [dragMode, onInteractionEnd]);

  return (
    <div id="viz-grid" className="viz-canvas active">
      <div
        id="grid-board"
        style={{
          gridTemplateRows: `repeat(${rows}, 22px)`,
          gridTemplateColumns: `repeat(${cols}, 22px)`,
        }}
      >
        {grid.map((rowArr, r) =>
          rowArr.map((cellVal, c) => {
            const isStart = r === startNode[0] && c === startNode[1];
            const isEnd = r === endNode[0] && c === endNode[1];

            // Determine base dynamic visual style
            let nodeClass = '';
            if (cellVal === 'wall') {
              nodeClass = 'node-wall';
            } else if (cellVal === 'weight') {
              nodeClass = 'node-weight';
            }

            // Path overlays
            if (!isStart && !isEnd) {
              const keyStr = `${r},${c}`;
              const visitedType = cellTypeMap[keyStr];
              if (visitedType === 'visit') {
                nodeClass += ' node-visited';
              } else if (visitedType === 'enqueue') {
                nodeClass += ' node-frontier';
              } else if (visitedType === 'path') {
                nodeClass += ' node-path';
              }
            }

            // Start/End anchors overrides
            if (isStart) {
              nodeClass += ' node-start';
            } else if (isEnd) {
              nodeClass += ' node-end';
            }

            return (
              <div
                key={`${r}-${c}`}
                className={`grid-node ${nodeClass}`}
                onMouseDown={(e) => handleCellMouseDown(e, r, c)}
                onMouseEnter={() => handleCellMouseEnter(r, c)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
