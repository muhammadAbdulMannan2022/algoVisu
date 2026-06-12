'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CodeSandboxProps {
  initialCode: string;
  activeLine: number; // 1-indexed, or -1 if none
  onCompile: (code: string) => void;
}

export default function CodeSandbox({ initialCode, activeLine, onCompile }: CodeSandboxProps) {
  const [code, setCode] = useState(initialCode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update editor text when initialCode changes
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const lines = code.split('\n');
  const lineCount = lines.length;

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleCompile = () => {
    onCompile(code);
  };

  return (
    <div id="code-sandbox" style={{ height: isCollapsed ? 'auto' : '250px' }}>
      <div 
        className="editor-header" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <span>{isCollapsed ? '▶' : '▼'} SANDBOX COMPILE KERNEL (JAVASCRIPT)</span>
        {!isCollapsed && (
          <button
            className="preset-btn"
            id="btn-compile"
            style={{ borderColor: 'var(--neon-green)', color: 'var(--neon-green)' }}
            onClick={(e) => {
              e.stopPropagation();
              handleCompile();
            }}
          >
            ⚛ COMPILE & RUN
          </button>
        )}
      </div>
      {!isCollapsed && (
        <div className="code-wrapper">
          {/* Line Gutter */}
          <div className="line-gutter" ref={gutterRef}>
            {Array.from({ length: lineCount }).map((_, idx) => {
              const isHighlighted = idx + 1 === activeLine;
              return (
                <div
                  key={idx}
                  style={{
                    color: isHighlighted ? 'var(--neon-cyan)' : '#334155',
                    fontWeight: isHighlighted ? 'bold' : 'normal',
                  }}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>

          {/* Text Area Code Editor */}
          <textarea
            ref={textareaRef}
            id="code-editor"
            spellCheck={false}
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleScroll}
          />
        </div>
      )}
    </div>
  );
}
