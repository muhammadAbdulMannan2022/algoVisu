'use client';

import React from 'react';
import { AlgoStep, MathData } from '../../core/types';

interface MathVisualizerProps {
  mathData: MathData;
  step: AlgoStep;
}

export default function MathVisualizer({ mathData, step }: MathVisualizerProps) {
  if (!mathData) return null;

  const { mode } = mathData;

  if (mode === 'sieve') {
    const max = mathData.max || 50;
    const primes = mathData.primes || {};
    const cells = Array.from({ length: max }, (_, idx) => idx + 1);

    return (
      <div id="viz-math" className="viz-canvas active">
        <div id="sieve-grid">
          {cells.map((i) => {
            let cellClass = '';
            if (i === 1) {
              cellClass = 'composite';
            } else if (primes[i] === true) {
              // prime
              if (step.type === 'done' || step.type === 'markPrime') {
                cellClass = 'prime';
              }
            } else if (primes[i] === false) {
              cellClass = 'composite';
            }

            // Interactive temporary sweeping highlights
            if (step.type === 'activePrime' && step.prime === i) {
              cellClass = 'active-p';
            } else if (step.type === 'checkMultiple' && step.index === i) {
              cellClass = 'checking';
            }

            return (
              <div key={`sieve-${i}`} className={`sieve-cell ${cellClass}`}>
                {i}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (mode === 'hanoi') {
    const pegs = mathData.pegs || [[], [], []];
    const totalDisks = mathData.totalDisks || 4;

    return (
      <div id="viz-math" className="viz-canvas active">
        <div id="hanoi-canvas">
          {pegs.map((pegDisks, pegIdx) => (
            <div key={`peg-${pegIdx}`} className="hanoi-peg">
              <div className="hanoi-peg-base" />
              {pegDisks.map((diskSize) => {
                // Compute width percent
                const wPercent = 30 + (diskSize / totalDisks) * 60;
                // Compute color hue
                const hue = (diskSize / totalDisks) * 120;

                return (
                  <div
                    key={`disk-${diskSize}`}
                    className="hanoi-disk"
                    style={{
                      width: `${wPercent}%`,
                      backgroundColor: `hsl(${hue}, 90%, 55%)`,
                      boxShadow: `0 0 10px hsla(${hue}, 90%, 55%, 0.45)`,
                    }}
                  >
                    {diskSize}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
