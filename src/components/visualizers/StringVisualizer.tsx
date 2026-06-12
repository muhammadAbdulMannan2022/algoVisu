'use client';

import React from 'react';
import { AlgoStep, StringData } from '../../core/types';

interface StringVisualizerProps {
  stringData: StringData;
  step: AlgoStep;
}

export default function StringVisualizer({ stringData, step }: StringVisualizerProps) {
  if (!stringData || !stringData.text) return null;

  const textChars = stringData.text.split('');
  const patChars = stringData.pattern.split('');

  // Calculate sliding alignment margin offset in pixels
  // In our CSS, .string-char is 32px wide + 4px gap = 36px offset per index
  const offset = step.type === 'charMatch' && step.textIdx !== undefined && step.patIdx !== undefined
    ? step.textIdx - step.patIdx
    : 0;

  return (
    <div id="viz-string" className="viz-canvas active">
      {/* Reference Text */}
      <label style={{ fontFamily: "'Share Tech Mono'", color: '#64748b', fontSize: '10px' }}>
        REFERENCE TEXT CORPUS
      </label>
      <div className="string-row">
        {textChars.map((char, idx) => {
          let charClass = '';
          if (step.type === 'charMatch' && step.textIdx === idx) {
            charClass = step.matches ? 'match' : 'mismatch';
          }
          return (
            <div key={`text-${idx}`} className={`string-char ${charClass}`}>
              {char}
            </div>
          );
        })}
      </div>

      {/* Pattern text */}
      <label style={{ fontFamily: "'Share Tech Mono'", color: '#64748b', fontSize: '10px', marginTop: '10px' }}>
        SEARCH PATTERN QUERY
      </label>
      <div
        className="string-row"
        style={{
          marginLeft: `${offset * 36}px`,
          transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {patChars.map((char, idx) => {
          let charClass = '';
          if (step.type === 'charMatch' && step.patIdx === idx) {
            charClass = step.matches ? 'match' : 'mismatch';
          }
          return (
            <div key={`pat-${idx}`} className={`string-char ${charClass}`}>
              {char}
            </div>
          );
        })}
      </div>
    </div>
  );
}
