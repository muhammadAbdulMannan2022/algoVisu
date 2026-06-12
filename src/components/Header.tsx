'use client';

import React from 'react';

interface HeaderProps {
  engineStatus: string;
}

export default function Header({ engineStatus }: HeaderProps) {
  return (
    <header id="topbar">
      <div className="brand">
        QUANTUM<em>VIZ</em> // v2.0
      </div>
      <div className="sys-status">
        <span className="dot-pulse"></span>
        <span>ENGINE STATUS: {engineStatus}</span>
        <span>|</span>
        <span>WORKSPACE: LOCALHOST</span>
      </div>
    </header>
  );
}
