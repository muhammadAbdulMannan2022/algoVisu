'use client';

import React, { useState } from 'react';

interface VariablesInspectorProps {
  vars: Record<string, any>;
}

export default function VariablesInspector({ vars }: VariablesInspectorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const varKeys = Object.keys(vars || {});

  return (
    <div id="variables-panel" style={{ height: isCollapsed ? 'auto' : '120px' }}>
      <div 
        className="editor-header" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <span>{isCollapsed ? '▶' : '▼'} ACTIVE STATE VARIABLE DEBUGGER INSPECTOR</span>
      </div>
      {!isCollapsed && (
        <div className="var-grid">
          {varKeys.map((key) => (
            <div key={key} className="var-item">
              <span className="var-name">{key}:</span>
              <span className="var-val">{JSON.stringify(vars[key])}</span>
            </div>
          ))}
          {varKeys.length === 0 && (
            <div style={{ gridColumn: 'span 2', color: 'var(--text-dim)', textAlign: 'center', fontSize: '10px' }}>
              NO ACTIVE VARIABLES
            </div>
          )}
        </div>
      )}
    </div>
  );
}
