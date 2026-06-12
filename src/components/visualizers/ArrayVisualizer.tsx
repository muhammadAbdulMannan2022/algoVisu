'use client';

import React from 'react';
import { AlgoStep } from '../../core/types';

interface ArrayVisualizerProps {
  array: number[];
  step: AlgoStep;
}

export default function ArrayVisualizer({ array, step }: ArrayVisualizerProps) {
  if (!array || array.length === 0) return null;

  const maxVal = Math.max(...array, 1);
  const activeIdx = (step.type === 'active' || step.type === 'compare') ? step.i : null;
  const compareIdx = (step.type === 'compare') ? step.j : null;
  const pivotIdx = (step.type === 'pivot') ? step.index : null;

  return (
    <div id="viz-array" className="viz-canvas active">
      {array.map((val, idx) => {
        // Normalize height between 5% and 95%
        const heightPercent = 5 + (val / maxVal) * 85;

        // Determine highlighting class
        let barClass = '';
        if (idx === activeIdx) {
          barClass = 'state-active';
        } else if (idx === compareIdx) {
          barClass = 'state-compare';
        } else if (idx === pivotIdx) {
          barClass = 'state-pivot';
        } else if (step.type === 'sorted' && step.index !== undefined && idx <= step.index) {
          barClass = 'state-sorted';
        } else if (step.type === 'done') {
          barClass = 'state-sorted';
        }

        return (
          <div key={idx} className="array-bar-col">
            <div
              className={`array-bar ${barClass}`}
              style={{ height: `${heightPercent}%` }}
            />
            <div className="array-val">{val}</div>
          </div>
        );
      })}
    </div>
  );
}
