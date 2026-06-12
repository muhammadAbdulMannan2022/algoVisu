'use client';

import React, { useState } from 'react';
import { ALGO_DATABASE } from '../core/algorithms';
import { AlgoCategory, Algorithm } from '../core/types';

interface SidebarProps {
  selectedAlgoId: string;
  onSelectAlgo: (id: string) => void;
}

const CATEGORIES: Array<{ key: AlgoCategory; label: string }> = [
  { key: 'all', label: 'ALL' },
  { key: 'sort', label: 'SORT' },
  { key: 'search', label: 'SEARCH' },
  { key: 'grid', label: 'GRID' },
  { key: 'graph', label: 'GRAPHS' },
  { key: 'lists', label: 'LISTS' },
  { key: 'dp', label: 'D-P' },
  { key: 'math', label: 'MATH' },
  { key: 'custom', label: 'CUSTOM' },
];

export default function Sidebar({ selectedAlgoId, onSelectAlgo }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<AlgoCategory>('all');

  // Filter algorithms
  const filteredAlgos = Object.values(ALGO_DATABASE).filter((algo) => {
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || algo.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getBadgeClass = (viz: string) => {
    switch (viz) {
      case 'grid':
        return 'badge-grid';
      case 'graph':
        return 'badge-graph';
      case 'matrix':
        return 'badge-mat';
      case 'string':
        return 'badge-str';
      case 'math':
        return 'badge-math';
      default:
        return 'badge-arr';
    }
  };

  return (
    <aside id="sidebar">
      {/* Search Input Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="⚡ SEARCH 105+ ALGORITHMS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category scroll container */}
      <div className="cat-scroll">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            className={`cat-pill ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </div>
        ))}
      </div>

      {/* Algorithms list */}
      <div className="algo-list">
        {filteredAlgos.map((algo) => (
          <div
            key={algo.id}
            className={`algo-item ${selectedAlgoId === algo.id ? 'active' : ''}`}
            onClick={() => onSelectAlgo(algo.id)}
          >
            <div className="algo-header-row">
              <span className="algo-name">{algo.name}</span>
              <span className={`algo-badge ${getBadgeClass(algo.visualizer)}`}>
                {algo.visualizer}
              </span>
            </div>
            <div className="algo-subinfo">
              <span>Time: {algo.complexity}</span>
              <span>Space: {algo.space}</span>
            </div>
          </div>
        ))}
        {filteredAlgos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-dim)', fontSize: '12px', fontFamily: 'var(--mono)' }}>
            NO ALGORITHMS FOUND
          </div>
        )}
      </div>
    </aside>
  );
}
