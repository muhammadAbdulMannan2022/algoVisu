'use client';

import React from 'react';

interface FooterProps {
  statusMsg: string;
}

export default function Footer({ statusMsg }: FooterProps) {
  return (
    <footer id="statusbar">
      <div id="statusbar-msg">{statusMsg}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '9px' }}>
        CRT OVERLAY : ACTIVE | CONTEXT: HIGH_VOLTAGE
      </div>
    </footer>
  );
}
