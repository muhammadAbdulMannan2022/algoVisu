'use client';

import React from 'react';
import { AlgoStep, MatrixData } from '../../core/types';

interface MatrixVisualizerProps {
  matrix: MatrixData;
  step: AlgoStep;
}

export default function MatrixVisualizer({ matrix, step }: MatrixVisualizerProps) {
  if (!matrix || !matrix.rows || !matrix.cols) return null;

  const { rows, cols, grid } = matrix;

  return (
    <div id="viz-matrix" className="viz-canvas active">
      <table id="matrix-table">
        <thead>
          <tr>
            <th />
            {cols.map((col, idx) => (
              <th key={`col-header-${idx}`}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((rowLabel, rIdx) => (
            <tr key={`row-${rIdx}`}>
              <th>{rowLabel}</th>
              {cols.map((_, cIdx) => {
                const val = grid[rIdx] ? grid[rIdx][cIdx] : null;
                const isCurrent = step && step.r === rIdx && step.c === cIdx;

                let cellClass = '';
                if (isCurrent) {
                  if (step.state === 'compare') {
                    cellClass = 'compare-cell';
                  } else if (step.state === 'solved') {
                    cellClass = 'solved-cell';
                  } else {
                    cellClass = 'active-cell';
                  }
                }

                return (
                  <td key={`cell-${rIdx}-${cIdx}`} className={cellClass}>
                    {val !== null ? val : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
