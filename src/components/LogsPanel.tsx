'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LogRow {
  ops: number;
  log: string;
  type: string;
}

interface LogsPanelProps {
  logs: LogRow[];
}

export default function LogsPanel({ logs }: LogsPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isCollapsed]);

  return (
    <div id="log-panel" style={{ flex: isCollapsed ? '0 0 auto' : '1' }}>
      <div 
        className="editor-header" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <span>{isCollapsed ? '▶' : '▼'} EXECUTION SEQUENCE TRACKER LOGS</span>
      </div>
      {!isCollapsed && (
        <div id="op-log" ref={logContainerRef}>
          {logs.map((row, idx) => (
            <div key={idx} className={`log-row ${row.type}`}>
              [{row.ops === 0 && row.type === 'init' ? 'SYSTEM' : `Step ${row.ops}`}] {row.log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
