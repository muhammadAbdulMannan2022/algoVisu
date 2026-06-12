'use client';

import React, { useState, useEffect } from 'react';

interface DynamicInputsProps {
  visualizer: 'array' | 'grid' | 'graph' | 'matrix' | 'string' | 'math';
  selectedAlgoId: string;

  // Array / GCD / Coin Change
  arrInput: number[];
  onArrayChange: (arr: number[]) => void;
  gcdA: number;
  gcdB: number;
  onGcdChange: (a: number, b: number) => void;
  coinChangeAmount: number;
  onCoinChangeAmountChange: (amount: number) => void;

  // Grid
  onResizeGrid: (rows: number, cols: number) => void;
  onClearWalls: () => void;
  onGenerateRandomWalls: () => void;

  // Graph
  graphNodes: Array<{ id: number; label: string; x: number; y: number; isObstacle?: boolean }>;
  graphStartNodeId: number;
  graphTargetNodeId: number;
  onGraphStartChange: (id: number) => void;
  onGraphTargetChange: (id: number) => void;
  onAddGraphNode: (label: string) => void;
  onDeleteGraphNode: (id: number) => void;
  onAddUpdateGraphEdge: (u: number, v: number, w?: number) => void;
  onDeleteGraphEdge: (u: number, v: number) => void;

  // DP / Matrix (Knapsack)
  knapsackWeights: number[];
  knapsackValues: number[];
  knapsackCapacity: number;
  onKnapsackChange: (weights: number[], values: number[], capacity: number) => void;

  // String (KMP)
  stringText: string;
  stringPattern: string;
  onStringChange: (text: string, pattern: string) => void;

  // Math (Sieve & Hanoi)
  sieveLimit: number;
  onSieveLimitChange: (limit: number) => void;
  hanoiDisks: number;
  onHanoiDisksChange: (disks: number) => void;

  // BST Insert
  bstInsertVal: number;
  onBstInsertValChange: (val: number) => void;
}

export default function DynamicInputs({
  visualizer,
  selectedAlgoId,
  arrInput,
  onArrayChange,
  gcdA,
  gcdB,
  onGcdChange,
  coinChangeAmount,
  onCoinChangeAmountChange,
  onResizeGrid,
  onClearWalls,
  onGenerateRandomWalls,
  graphNodes,
  graphStartNodeId,
  graphTargetNodeId,
  onGraphStartChange,
  onGraphTargetChange,
  onAddGraphNode,
  onDeleteGraphNode,
  onAddUpdateGraphEdge,
  onDeleteGraphEdge,
  knapsackWeights,
  knapsackValues,
  knapsackCapacity,
  onKnapsackChange,
  stringText,
  stringPattern,
  onStringChange,
  sieveLimit,
  onSieveLimitChange,
  hanoiDisks,
  onHanoiDisksChange,
  bstInsertVal,
  onBstInsertValChange,
}: DynamicInputsProps) {
  const [arrText, setArrText] = useState(arrInput.join(', '));
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [deleteNodeId, setDeleteNodeId] = useState<number | ''>('');
  
  // Edge manager state
  const [edgeU, setEdgeU] = useState<number | ''>('');
  const [edgeV, setEdgeV] = useState<number | ''>('');
  const [edgeW, setEdgeW] = useState<number | ''>('');

  // Knapsack string inputs
  const [kpWeightsText, setKpWeightsText] = useState(knapsackWeights.join(', '));
  const [kpValuesText, setKpValuesText] = useState(knapsackValues.join(', '));
  const [kpCapacity, setKpCapacity] = useState(knapsackCapacity);

  // String matcher state
  const [strText, setStrText] = useState(stringText);
  const [strPattern, setStrPattern] = useState(stringPattern);

  // Math input state
  const [mathLimit, setMathLimit] = useState(sieveLimit);
  const [disksCount, setDisksCount] = useState(hanoiDisks);

  // GCD numbers
  const [numA, setNumA] = useState(gcdA);
  const [numB, setNumB] = useState(gcdB);

  // Sync internal texts with external props
  useEffect(() => {
    setArrText(arrInput.join(', '));
  }, [arrInput]);

  useEffect(() => {
    setKpWeightsText(knapsackWeights.join(', '));
    setKpValuesText(knapsackValues.join(', '));
    setKpCapacity(knapsackCapacity);
  }, [knapsackWeights, knapsackValues, knapsackCapacity]);

  useEffect(() => {
    setStrText(stringText);
    setStrPattern(stringPattern);
  }, [stringText, stringPattern]);

  useEffect(() => {
    setMathLimit(sieveLimit);
  }, [sieveLimit]);

  useEffect(() => {
    setDisksCount(hanoiDisks);
  }, [hanoiDisks]);

  useEffect(() => {
    setNumA(gcdA);
    setNumB(gcdB);
  }, [gcdA, gcdB]);

  const handleArrayTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArrText(e.target.value);
    const parsed = e.target.value
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));
    onArrayChange(parsed);
  };

  const handlePreset = (type: 'random' | 'sorted' | 'reversed') => {
    let newArr: number[] = [];
    if (type === 'random') {
      newArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 95) + 5);
    } else if (type === 'sorted') {
      newArr = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95];
    } else if (type === 'reversed') {
      newArr = [95, 85, 75, 65, 55, 45, 35, 25, 15, 5];
    }
    onArrayChange(newArr);
    setArrText(newArr.join(', '));
  };

  const handleAddNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeLabel.trim()) return;
    onAddGraphNode(newNodeLabel.trim());
    setNewNodeLabel('');
  };

  const handleEdgeSubmit = (e: React.FormEvent, type: 'add' | 'delete') => {
    e.preventDefault();
    if (edgeU === '' || edgeV === '') return;
    if (type === 'add') {
      onAddUpdateGraphEdge(edgeU, edgeV, edgeW !== '' ? edgeW : undefined);
    } else {
      onDeleteGraphEdge(edgeU, edgeV);
    }
  };

  const handleKnapsackSubmit = () => {
    const weights = kpWeightsText.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
    const values = kpValuesText.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
    onKnapsackChange(weights, values, kpCapacity);
  };

  const handleStringSubmit = () => {
    onStringChange(strText, strPattern);
  };

  if (visualizer === 'grid') {
    return (
      <div id="dynamic-inputs">
        <label>Grid Controls & Obstacles</label>
        <div className="presets-row">
          <button className="preset-btn" onClick={() => onResizeGrid(8, 12)}>Small (8x12)</button>
          <button className="preset-btn" onClick={() => onResizeGrid(12, 20)}>Medium (12x20)</button>
          <button className="preset-btn" onClick={() => onResizeGrid(18, 30)}>Large (18x30)</button>
          <button className="preset-btn" style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }} onClick={onGenerateRandomWalls}>Random Obstacles</button>
          <button className="preset-btn" onClick={onClearWalls}>Clear Walls</button>
        </div>
        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '8px', lineHeight: '1.4' }}>
          🖱 Click & Drag to paint <b>Walls</b>. Drag anchors to shift start/end.<br />
          ⌨ Hold <b>Shift</b> + drag to paint <b>Weights⚓</b>.
        </div>
      </div>
    );
  }

  if (visualizer === 'graph') {
    return (
      <div id="dynamic-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '350px' }}>
        <div>
          <label>Start & Target Nodes</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Start Node</span>
              <select 
                className="input-field" 
                value={graphStartNodeId}
                onChange={(e) => onGraphStartChange(parseInt(e.target.value, 10))}
              >
                {graphNodes.map(n => <option key={n.id} value={n.id}>{n.label}{n.isObstacle ? ' (Blocked)' : ''}</option>)}
              </select>
            </div>
            {selectedAlgoId === 'dijkstra' && (
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Target Node</span>
                <select 
                  className="input-field" 
                  value={graphTargetNodeId}
                  onChange={(e) => onGraphTargetChange(parseInt(e.target.value, 10))}
                >
                  {graphNodes.map(n => <option key={n.id} value={n.id}>{n.label}{n.isObstacle ? ' (Blocked)' : ''}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {selectedAlgoId === 'bstinsert' && (
          <div>
            <label>BST Insertion Value</label>
            <input 
              type="number" 
              className="input-field" 
              value={bstInsertVal} 
              onChange={e => onBstInsertValChange(parseInt(e.target.value, 10) || 0)} 
            />
          </div>
        )}

        {/* Node Manager */}
        <div>
          <label>Vertex Manager</label>
          <form onSubmit={handleAddNodeSubmit} style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Node Label (e.g. I)" 
              value={newNodeLabel} 
              onChange={e => setNewNodeLabel(e.target.value)}
              style={{ flex: 2 }}
            />
            <button type="submit" className="preset-btn" style={{ flex: 1 }}>Add Node</button>
          </form>
          
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
            <select 
              className="input-field"
              value={deleteNodeId}
              onChange={e => setDeleteNodeId(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              style={{ flex: 2 }}
            >
              <option value="">Select Node to Delete</option>
              {graphNodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            <button 
              className="preset-btn" 
              style={{ flex: 1, borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}
              onClick={() => {
                if (deleteNodeId !== '') {
                  onDeleteGraphNode(deleteNodeId);
                  setDeleteNodeId('');
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Edge Manager */}
        <div>
          <label>Edge Connection Manager</label>
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
            <select className="input-field" value={edgeU} onChange={e => setEdgeU(e.target.value === '' ? '' : parseInt(e.target.value, 10))}>
              <option value="">Node U</option>
              {graphNodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            <select className="input-field" value={edgeV} onChange={e => setEdgeV(e.target.value === '' ? '' : parseInt(e.target.value, 10))}>
              <option value="">Node V</option>
              {graphNodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            {selectedAlgoId === 'dijkstra' && (
              <input 
                type="number" 
                className="input-field" 
                placeholder="W" 
                value={edgeW} 
                onChange={e => setEdgeW(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                style={{ width: '50px' }}
              />
            )}
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
            <button className="preset-btn" style={{ flex: 1 }} onClick={(e) => handleEdgeSubmit(e, 'add')}>Add/Update Edge</button>
            <button className="preset-btn" style={{ flex: 1 }} onClick={(e) => handleEdgeSubmit(e, 'delete')}>Delete Edge</button>
          </div>
        </div>

        <div style={{ fontSize: '10px', color: '#64748b', lineHeight: '1.4' }}>
          🖱 Drag vertices to position nodes. <br />
          ⌨ <b>Double-click</b> nodes to toggle obstacle block (neon red X).
        </div>
      </div>
    );
  }

  if (visualizer === 'matrix') {
    return (
      <div id="dynamic-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label>0/1 Knapsack Parameters</label>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Weights (comma-separated):</span>
          <input type="text" className="input-field" value={kpWeightsText} onChange={e => setKpWeightsText(e.target.value)} />
        </div>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Values (comma-separated):</span>
          <input type="text" className="input-field" value={kpValuesText} onChange={e => setKpValuesText(e.target.value)} />
        </div>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Knapsack Max Capacity:</span>
          <input type="number" className="input-field" value={kpCapacity} onChange={e => setKpCapacity(parseInt(e.target.value, 10) || 0)} />
        </div>
        <button className="preset-btn" style={{ marginTop: '4px' }} onClick={handleKnapsackSubmit}>Update Knapsack DP</button>
      </div>
    );
  }

  if (visualizer === 'string') {
    return (
      <div id="dynamic-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label>String Pattern Matcher (KMP)</label>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Text Source:</span>
          <input type="text" className="input-field" value={strText} onChange={e => setStrText(e.target.value)} />
        </div>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Search Pattern:</span>
          <input type="text" className="input-field" value={strPattern} onChange={e => setStrPattern(e.target.value)} />
        </div>
        <button className="preset-btn" style={{ marginTop: '4px' }} onClick={handleStringSubmit}>Run Pattern Scan</button>
      </div>
    );
  }

  if (visualizer === 'math') {
    if (selectedAlgoId === 'sieve') {
      return (
        <div id="dynamic-inputs">
          <label>Sieve Prime Limit</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={mathLimit} 
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                setMathLimit(val);
                onSieveLimitChange(val);
              }}
              style={{ flex: 1, accentColor: 'var(--neon-cyan)' }}
            />
            <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--neon-cyan)', minWidth: '28px' }}>{mathLimit}</span>
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px' }}>
            Specifies maximum range boundary limit for prime sieve calculations.
          </div>
        </div>
      );
    }
    
    if (selectedAlgoId === 'hanoi') {
      return (
        <div id="dynamic-inputs">
          <label>Tower of Hanoi Disks</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <input 
              type="range" 
              min="3" 
              max="8" 
              value={disksCount} 
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                setDisksCount(val);
                onHanoiDisksChange(val);
              }}
              style={{ flex: 1, accentColor: 'var(--neon-cyan)' }}
            />
            <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--neon-cyan)', minWidth: '20px' }}>{disksCount}</span>
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px' }}>
            Sets the count of disks (3-8) to solve Peg steps recursively.
          </div>
        </div>
      );
    }
  }

  if (selectedAlgoId === 'gcd') {
    return (
      <div id="dynamic-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label>Greatest Common Divisor (GCD)</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Number A</span>
            <input type="number" className="input-field" value={numA} onChange={e => {
              const val = parseInt(e.target.value, 10) || 0;
              setNumA(val);
              onGcdChange(val, numB);
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Number B</span>
            <input type="number" className="input-field" value={numB} onChange={e => {
              const val = parseInt(e.target.value, 10) || 0;
              setNumB(val);
              onGcdChange(numA, val);
            }} />
          </div>
        </div>
        <div style={{ fontSize: '10px', color: '#64748b' }}>
          Euclidean modulo operations dynamically reduce inputs step-by-step.
        </div>
      </div>
    );
  }

  if (selectedAlgoId === 'coinchange') {
    return (
      <div id="dynamic-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label>Coin Change Settings</label>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Coin Denominations (comma-separated):</span>
          <input type="text" className="input-field" value={arrText} onChange={handleArrayTextChange} />
        </div>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Target Amount:</span>
          <input type="number" className="input-field" value={coinChangeAmount} onChange={e => {
            const val = parseInt(e.target.value, 10) || 0;
            onCoinChangeAmountChange(val);
          }} />
        </div>
        <div style={{ fontSize: '10px', color: '#64748b' }}>
          Computes recursive coin configurations up to target amount.
        </div>
      </div>
    );
  }

  // Default / Array visualizer (Sorting & Searches)
  return (
    <div id="dynamic-inputs">
      <label>Integer Array Elements preset</label>
      <input
        type="text"
        id="arr-val-inp"
        className="input-field"
        value={arrText}
        onChange={handleArrayTextChange}
      />
      <div className="presets-row" style={{ marginTop: '8px' }}>
        <button className="preset-btn" onClick={() => handlePreset('random')}>Randomize</button>
        <button className="preset-btn" onClick={() => handlePreset('sorted')}>Sorted</button>
        <button className="preset-btn" onClick={() => handlePreset('reversed')}>Reversed</button>
      </div>
    </div>
  );
}
