'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import PlaybackPanel from '../components/PlaybackPanel';
import DynamicInputs from '../components/DynamicInputs';
import CodeSandbox from '../components/CodeSandbox';
import VariablesInspector from '../components/VariablesInspector';
import LogsPanel from '../components/LogsPanel';

// Visualizers
import ArrayVisualizer from '../components/visualizers/ArrayVisualizer';
import GridVisualizer from '../components/visualizers/GridVisualizer';
import GraphVisualizer from '../components/visualizers/GraphVisualizer';
import MatrixVisualizer from '../components/visualizers/MatrixVisualizer';
import StringVisualizer from '../components/visualizers/StringVisualizer';
import MathVisualizer from '../components/visualizers/MathVisualizer';

// Core
import { ALGO_DATABASE } from '../core/algorithms';
import { AlgoStep, Algorithm, GraphData, MatrixData, StringData, MathData } from '../core/types';

export default function DashboardPage() {
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('bubble');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(150);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [steps, setSteps] = useState<AlgoStep[]>([]);
  const [statusMsg, setStatusMsg] = useState<string>('QuantumViz Sandbox IDE Engine initialized successfully.');
  const [engineStatus, setEngineStatus] = useState<string>('ON-LINE');

  // Input States
  const [arrInput, setArrInput] = useState<number[]>([45, 12, 89, 34, 67, 23, 78, 56, 90, 9]);
  
  // Grid config
  const [gridRows, setGridRows] = useState<number>(12);
  const [gridCols, setGridCols] = useState<number>(20);
  const [startNode, setStartNode] = useState<[number, number]>([3, 3]);
  const [endNode, setEndNode] = useState<[number, number]>([8, 16]);
  const [gridState, setGridState] = useState<string[][]>(() =>
    Array.from({ length: 12 }, () => Array(20).fill('empty'))
  );

  // Graph state (shared so user drags nodes on the canvas, persisting positions across steps)
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [
      { id: 0, label: 'A', x: 80, y: 150 },
      { id: 1, label: 'B', x: 200, y: 70 },
      { id: 2, label: 'C', x: 200, y: 230 },
      { id: 3, label: 'D', x: 320, y: 70 },
      { id: 4, label: 'E', x: 320, y: 230 },
      { id: 5, label: 'F', x: 440, y: 150 },
      { id: 6, label: 'G', x: 440, y: 70 },
      { id: 7, label: 'H', x: 540, y: 150 }
    ],
    edges: [
      { u: 0, v: 1, w: 3 }, { u: 0, v: 2, w: 5 },
      { u: 1, v: 2, w: 1 }, { u: 1, v: 3, w: 2 },
      { u: 2, v: 4, w: 4 }, { u: 3, v: 4, w: 2 },
      { u: 3, v: 6, w: 3 }, { u: 4, v: 5, w: 1 },
      { u: 5, v: 6, w: 2 }, { u: 5, v: 7, w: 3 },
      { u: 6, v: 7, w: 2 }
    ]
  });

  // Additional Dynamic States
  const [gcdA, setGcdA] = useState<number>(84);
  const [gcdB, setGcdB] = useState<number>(18);
  const [coinChangeAmount, setCoinChangeAmount] = useState<number>(12);
  const [knapsackWeights, setKnapsackWeights] = useState<number[]>([2, 3, 4, 5]);
  const [knapsackValues, setKnapsackValues] = useState<number[]>([3, 4, 5, 6]);
  const [knapsackCapacity, setKnapsackCapacity] = useState<number>(5);
  const [stringText, setStringText] = useState<string>("AABAACAADAABAABA");
  const [stringPattern, setStringPattern] = useState<string>("AABA");
  const [sieveLimit, setSieveLimit] = useState<number>(50);
  const [hanoiDisks, setHanoiDisks] = useState<number>(4);
  const [graphStartNodeId, setGraphStartNodeId] = useState<number>(0);
  const [graphTargetNodeId, setGraphTargetNodeId] = useState<number>(7);
  const [bstInsertVal, setBstInsertVal] = useState<number>(45);

  // Sandbox compilation states
  const [customCode, setCustomCode] = useState<string>('');
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(false);

  // Playback timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeAlgo = ALGO_DATABASE[selectedAlgoId];

  // Compile custom sandbox generator function
  const compileCustomCode = (srcCode: string, ...args: any[]) => {
    const fnNameMatch = srcCode.match(/function\*\s+(\w+)\s*\(/);
    if (!fnNameMatch) {
      throw new Error("Missing generator function! Must declare 'function* myAlgo(...) { ... }'");
    }
    const fnName = fnNameMatch[1];
    // Dynamic execution wrapper
    const builder = new Function(`${srcCode} return ${fnName};`);
    const generatorCompiled = builder();
    return generatorCompiled(...args);
  };

  // Generate snapshots based on active visualizer
  const generateSnapshots = useCallback((algo: Algorithm) => {
    const computedSteps: AlgoStep[] = [];
    let opsCount = 0;

    const pushStep = (step: Omit<AlgoStep, 'ops'>) => {
      computedSteps.push({
        ...step,
        ops: opsCount++,
      });
    };

    if (algo.visualizer === 'grid') {
      const gridClone = gridState.map((row) => [...row]);
      const genRunner = (isSandboxMode || algo.isCustom)
        ? compileCustomCode(customCode, gridClone, [...startNode], [...endNode])
        : algo.generator(gridClone, [...startNode], [...endNode]);
      let hasMore = true;
      const activeGridSteps: Array<{ r: number; c: number; type: string }> = [];

      pushStep({
        grid: gridClone.map((row) => [...row]),
        gridState: [],
        log: 'Initialize pathfinder grid.',
        vars: { start: startNode.join(','), target: endNode.join(',') },
        type: 'init',
      });

      while (hasMore && opsCount < 3000) {
        try {
          const res = genRunner.next();
          if (res.done) {
            hasMore = false;
            pushStep({
              grid: gridClone.map((row) => [...row]),
              gridState: [...activeGridSteps],
              log: res.value?.log || 'Grid traversal resolved.',
              vars: res.value?.vars || {},
              type: 'done',
            });
          } else {
            const stepVal = res.value || {};
            if (stepVal.type === 'cellularUpdate') {
              // Conway's cellular grid updates
              stepVal.grid.forEach((rowArr: string[], rIdx: number) => {
                rowArr.forEach((val: string, cIdx: number) => {
                  gridClone[rIdx][cIdx] = val;
                });
              });
            } else if (stepVal.r !== undefined && stepVal.c !== undefined) {
              activeGridSteps.push({
                r: stepVal.r,
                c: stepVal.c,
                type: stepVal.type || 'visit',
              });
            }

            pushStep({
              grid: gridClone.map((row) => [...row]),
              gridState: [...activeGridSteps],
              log:
                stepVal.log ||
                (stepVal.r !== undefined
                  ? `Frontier checked cell (${stepVal.r}, ${stepVal.c})`
                  : `Grid operation completed`),
              vars: stepVal.vars || {},
              type: stepVal.type || 'visit',
            });
          }
        } catch (err: any) {
          hasMore = false;
          pushStep({
            grid: gridClone.map((row) => [...row]),
            gridState: [...activeGridSteps],
            log: `Grid Pathfinding Error: ${err.message}`,
            vars: {},
            type: 'done',
          });
        }
      }
    } else if (algo.visualizer === 'graph') {
      const customGraph = JSON.parse(JSON.stringify(graphData));
      
      let genRunner;
      if (isSandboxMode || algo.isCustom) {
        if (algo.id === 'bfs' || algo.id === 'dfs') {
          genRunner = compileCustomCode(customCode, customGraph, graphStartNodeId);
        } else if (algo.id === 'dijkstra') {
          genRunner = compileCustomCode(customCode, customGraph, graphStartNodeId, graphTargetNodeId);
        } else if (algo.id === 'bstinsert') {
          genRunner = compileCustomCode(customCode, customGraph, bstInsertVal);
        } else {
          genRunner = compileCustomCode(customCode, customGraph);
        }
      } else {
        if (algo.id === 'bfs' || algo.id === 'dfs') {
          genRunner = algo.generator(customGraph, graphStartNodeId);
        } else if (algo.id === 'dijkstra') {
          genRunner = algo.generator(customGraph, graphStartNodeId, graphTargetNodeId);
        } else if (algo.id === 'bstinsert') {
          genRunner = algo.generator(customGraph, bstInsertVal);
        } else {
          genRunner = algo.generator(customGraph);
        }
      }

      let hasMore = true;

      pushStep({
        graph: JSON.parse(JSON.stringify(customGraph)),
        log: 'Adjacency vertex sets constructed.',
        vars: {},
        type: 'init',
      });

      while (hasMore && opsCount < 500) {
        try {
          const res = genRunner.next();
          if (res.done) {
            hasMore = false;
            pushStep({
              graph: JSON.parse(JSON.stringify(customGraph)),
              log: res.value?.log || 'Graph traversal resolved.',
              vars: {},
              type: 'done',
            });
          } else {
            const stepVal = res.value || {};
            if (stepVal.type === 'initGraph') {
              customGraph.nodes = stepVal.nodes;
              customGraph.edges = stepVal.edges;
            }
            pushStep({
              graph: JSON.parse(JSON.stringify(customGraph)),
              log: stepVal.log || 'Evaluating vertex pathways',
              vars: stepVal.vars || {},
              type: stepVal.type,
              node: stepVal.node,
              u: stepVal.u,
              v: stepVal.v,
            });
          }
        } catch (err: any) {
          hasMore = false;
          pushStep({
            graph: JSON.parse(JSON.stringify(customGraph)),
            log: `Traversal Error: ${err.message}`,
            vars: {},
            type: 'done',
          });
        }
      }
    } else if (algo.visualizer === 'matrix') {
      const matrixState: MatrixData = { rows: [], cols: [], grid: [] };
      const genRunner = (isSandboxMode || algo.isCustom)
        ? (algo.id === 'knapsack' ? compileCustomCode(customCode, knapsackWeights, knapsackValues, knapsackCapacity) : compileCustomCode(customCode))
        : (algo.id === 'knapsack' ? algo.generator(knapsackWeights, knapsackValues, knapsackCapacity) : algo.generator());
      let hasMore = true;

      pushStep({
        matrix: JSON.parse(JSON.stringify(matrixState)),
        log: 'Set recurrence grid boundaries.',
        vars: {},
        type: 'init',
      });

      while (hasMore && opsCount < 1000) {
        const res = genRunner.next();
        if (res.done) {
          hasMore = false;
          pushStep({
            matrix: JSON.parse(JSON.stringify(matrixState)),
            log: res.value?.log || 'DP computation complete!',
            vars: {},
            type: 'done',
          });
        } else {
          const stepVal = res.value || {};
          if (stepVal.type === 'initMatrix') {
            matrixState.rows = stepVal.rows;
            matrixState.cols = stepVal.cols;
            matrixState.grid = Array.from({ length: stepVal.rows.length }, () =>
              Array(stepVal.cols.length).fill(null)
            );
          } else if (stepVal.type === 'cellUpdate') {
            if (matrixState.grid[stepVal.r]) {
              matrixState.grid[stepVal.r][stepVal.c] = stepVal.val;
            }
          }

          pushStep({
            matrix: JSON.parse(JSON.stringify(matrixState)),
            log: stepVal.log || 'Evaluating matrix recurrence transition',
            vars: stepVal.vars || {},
            type: stepVal.type,
            r: stepVal.r,
            c: stepVal.c,
            state: stepVal.state,
          });
        }
      }
    } else if (algo.visualizer === 'string') {
      const stringState: StringData = { text: '', pattern: '' };
      const genRunner = (isSandboxMode || algo.isCustom)
        ? (algo.id === 'kmp' ? compileCustomCode(customCode, stringText, stringPattern) : compileCustomCode(customCode))
        : (algo.id === 'kmp' ? algo.generator(stringText, stringPattern) : algo.generator());
      let hasMore = true;

      pushStep({
        string: { ...stringState },
        log: 'Set comparison string registers.',
        vars: {},
        type: 'init',
      });

      while (hasMore && opsCount < 500) {
        const res = genRunner.next();
        if (res.done) {
          hasMore = false;
          pushStep({
            string: { ...stringState },
            log: 'String scanning completed.',
            vars: {},
            type: 'done',
          });
        } else {
          const stepVal = res.value || {};
          if (stepVal.type === 'initString') {
            stringState.text = stepVal.text;
            stringState.pattern = stepVal.pattern;
          }
          pushStep({
            string: { ...stringState },
            log: stepVal.log || 'Pattern shifting comparisons',
            vars: stepVal.vars || {},
            type: stepVal.type,
            textIdx: stepVal.textIdx,
            patIdx: stepVal.patIdx,
            matches: stepVal.matches,
          });
        }
      }
    } else if (algo.visualizer === 'math') {
      const mathState: MathData = {
        mode: 'sieve',
        primes: {},
        max: sieveLimit,
        pegs: [[], [], []],
        totalDisks: hanoiDisks,
      };
      const genRunner = (isSandboxMode || algo.isCustom)
        ? (algo.id === 'sieve' ? compileCustomCode(customCode, sieveLimit) : algo.id === 'hanoi' ? compileCustomCode(customCode, hanoiDisks) : compileCustomCode(customCode))
        : (algo.id === 'sieve' ? algo.generator(sieveLimit) : algo.id === 'hanoi' ? algo.generator(hanoiDisks) : algo.generator());
      let hasMore = true;

      pushStep({
        math: JSON.parse(JSON.stringify(mathState)),
        log: 'Initialize computational structures.',
        vars: {},
        type: 'init',
      });

      while (hasMore && opsCount < 1000) {
        const res = genRunner.next();
        if (res.done) {
          hasMore = false;
          pushStep({
            math: JSON.parse(JSON.stringify(mathState)),
            log: 'Math operations calculated.',
            vars: {},
            type: 'done',
          });
        } else {
          const stepVal = res.value || {};

          if (stepVal.type === 'initSieve') {
            mathState.mode = 'sieve';
            mathState.max = stepVal.max;
            mathState.primes = {};
            for (let x = 2; x <= stepVal.max; x++) mathState.primes[x] = true;
          } else if (stepVal.type === 'checkMultiple') {
            if (mathState.primes) mathState.primes[stepVal.index] = false;
          } else if (stepVal.type === 'markPrime') {
            if (mathState.primes) mathState.primes[stepVal.index] = true;
          } else if (stepVal.type === 'initHanoi') {
            mathState.mode = 'hanoi';
            mathState.totalDisks = stepVal.disks;
            mathState.pegs = [
              Array.from({ length: stepVal.disks }, (_, i) => stepVal.disks - i),
              [],
              [],
            ];
          } else if (stepVal.type === 'moveDisk') {
            if (mathState.pegs) {
              const disk = mathState.pegs[stepVal.from].pop();
              if (disk !== undefined) mathState.pegs[stepVal.to].push(disk);
            }
          }

          pushStep({
            math: JSON.parse(JSON.stringify(mathState)),
            log: stepVal.log || 'Executing math operations',
            vars: stepVal.vars || {},
            type: stepVal.type,
            prime: stepVal.prime,
            index: stepVal.index,
          });
        }
      }
    } else {
      // 1D Array mode (Sorting & Searching)
      const arrayClone = [...arrInput];
      let genRunner;

      try {
        if (isSandboxMode || algo.isCustom) {
          genRunner = compileCustomCode(customCode, arrayClone);
        } else if (algo.id === 'gcd') {
          genRunner = algo.generator(gcdA, gcdB);
        } else if (algo.id === 'coinchange') {
          genRunner = algo.generator(arrayClone, coinChangeAmount);
        } else {
          genRunner = algo.generator(arrayClone);
        }
      } catch (err: any) {
        pushStep({
          array: [...arrayClone],
          log: `Compilation Error: ${err.message}`,
          vars: {},
          type: 'compare',
        });
        setSteps(computedSteps);
        setStepIdx(0);
        return;
      }

      let hasMore = true;

      pushStep({
        array: [...arrayClone],
        log: 'Initial State loaded.',
        vars: { index: 0 },
        type: 'init',
      });

      while (hasMore && opsCount < 2000) {
        try {
          const res = genRunner.next();
          if (res.done) {
            hasMore = false;
            pushStep({
              array: [...arrayClone],
              log: res.value?.log || 'Simulation completed!',
              vars: res.value?.vars || {},
              type: 'done',
            });
          } else {
            const stepVal = res.value || {};
            pushStep({
              array: [...arrayClone],
              log: stepVal.log || `Execution step: ${opsCount}`,
              vars: stepVal.vars || {},
              type: stepVal.type || 'active',
              i: stepVal.i,
              j: stepVal.j,
              index: stepVal.index,
            });
          }
        } catch (err: any) {
          hasMore = false;
          pushStep({
            array: [...arrayClone],
            log: `Runtime Error: ${err.message}`,
            vars: {},
            type: 'compare',
          });
        }
      }
    }

    setSteps(computedSteps);
    setStepIdx(0);
  }, [
    arrInput,
    gridState,
    startNode,
    endNode,
    graphData,
    isSandboxMode,
    customCode,
    gcdA,
    gcdB,
    coinChangeAmount,
    knapsackWeights,
    knapsackValues,
    knapsackCapacity,
    stringText,
    stringPattern,
    sieveLimit,
    hanoiDisks,
    graphStartNodeId,
    graphTargetNodeId,
    bstInsertVal,
  ]);

  // Handle compilation sandbox code changes
  const handleCompileCode = (code: string) => {
    setIsPlaying(false);
    setIsSandboxMode(true);
    setCustomCode(code);
    setStatusMsg('Compiling sandboxed code...');

    // Assign custom code details onto the active object
    if (activeAlgo) {
      activeAlgo.isCustom = true;
      activeAlgo.code = code;
    }

    // Force regenerate using compile mode
    setTimeout(() => {
      generateSnapshots(activeAlgo);
      setStatusMsg('Sandboxed custom code compiled successfully. Running simulation...');
    }, 100);
  };

  const handleSelectAlgorithm = (id: string) => {
    setIsPlaying(false);
    setSelectedAlgoId(id);
    setIsSandboxMode(false);

    const targetAlgo = ALGO_DATABASE[id];
    setCustomCode(targetAlgo.code);
    setStatusMsg(`Selected ${targetAlgo.name}. Buffer initialized.`);

    // If grid size presets match, resize
    if (targetAlgo.visualizer === 'grid') {
      resizeGridBoard(12, 20);
    } else if (targetAlgo.visualizer === 'graph') {
      // If tree-based algorithm, reset graph to tree mock
      if (['inorder', 'preorder', 'postorder', 'bstinsert'].includes(id)) {
        setGraphData({
          nodes: [
            { id: 1, label: '50', x: 220, y: 50 },
            { id: 2, label: '30', x: 140, y: 110 },
            { id: 3, label: '70', x: 300, y: 110 },
            { id: 4, label: '20', x: 90, y: 170 },
            { id: 5, label: '40', x: 190, y: 170 },
            { id: 6, label: '60', x: 260, y: 170 },
            { id: 7, label: '80', x: 340, y: 170 },
            { id: 8, label: '10', x: 60, y: 230 },
            { id: 9, label: '25', x: 120, y: 230 }
          ],
          edges: [
            { u: 1, v: 2 }, { u: 1, v: 3 },
            { u: 2, v: 4 }, { u: 2, v: 5 },
            { u: 3, v: 6 }, { u: 3, v: 7 },
            { u: 4, v: 8 }, { u: 4, v: 9 }
          ]
        });
        setGraphStartNodeId(1);
        setGraphTargetNodeId(9);
        setBstInsertVal(45);
      } else {
        // Standard graph
        setGraphData({
          nodes: [
            { id: 0, label: 'A', x: 80, y: 150 },
            { id: 1, label: 'B', x: 200, y: 70 },
            { id: 2, label: 'C', x: 200, y: 230 },
            { id: 3, label: 'D', x: 320, y: 70 },
            { id: 4, label: 'E', x: 320, y: 230 },
            { id: 5, label: 'F', x: 440, y: 150 },
            { id: 6, label: 'G', x: 440, y: 70 },
            { id: 7, label: 'H', x: 540, y: 150 }
          ],
          edges: [
            { u: 0, v: 1, w: 3 }, { u: 0, v: 2, w: 5 },
            { u: 1, v: 2, w: 1 }, { u: 1, v: 3, w: 2 },
            { u: 2, v: 4, w: 4 }, { u: 3, v: 4, w: 2 },
            { u: 3, v: 6, w: 3 }, { u: 4, v: 5, w: 1 },
            { u: 5, v: 6, w: 2 }, { u: 5, v: 7, w: 3 },
            { u: 6, v: 7, w: 2 }
          ]
        });
        setGraphStartNodeId(0);
        setGraphTargetNodeId(7);
      }
    } else {
      setTimeout(() => {
        generateSnapshots(targetAlgo);
      }, 50);
    }
  };

  const resizeGridBoard = (r: number, c: number) => {
    setIsPlaying(false);
    setGridRows(r);
    setGridCols(c);
    const start: [number, number] = [Math.floor(r / 3), Math.floor(c / 4)];
    const end: [number, number] = [Math.floor((r * 2) / 3), Math.floor((c * 3) / 4)];
    setStartNode(start);
    setEndNode(end);

    const initialGrid = Array.from({ length: r }, () => Array(c).fill('empty'));
    setGridState(initialGrid);

    setStatusMsg(`Resized pathfinder board to ${r}x${c}.`);
  };

  const clearActiveGridWalls = () => {
    setIsPlaying(false);
    const cleared = gridState.map((row) => row.map(() => 'empty'));
    setGridState(cleared);
    setStatusMsg('Grid board layout walls cleared.');
  };

  const generateRandomGridWalls = () => {
    setIsPlaying(false);
    const randomized = gridState.map((row, r) =>
      row.map((cell, c) => {
        if ((r === startNode[0] && c === startNode[1]) || (r === endNode[0] && c === endNode[1])) {
          return 'empty';
        }
        return Math.random() < 0.25 ? 'wall' : 'empty';
      })
    );
    setGridState(randomized);
    setStatusMsg('Random grid wall configurations generated.');
  };

  // Graph actions
  const handleAddGraphNode = (label: string) => {
    setGraphData(prev => {
      const nextId = prev.nodes.length > 0 ? Math.max(...prev.nodes.map(n => n.id)) + 1 : 0;
      const x = 100 + Math.floor(Math.random() * 300);
      const y = 80 + Math.floor(Math.random() * 140);
      const updatedNodes = [...prev.nodes, { id: nextId, label, x, y }];
      return { ...prev, nodes: updatedNodes };
    });
    setStatusMsg(`Added vertex node '${label}'`);
  };

  const handleDeleteGraphNode = (id: number) => {
    setGraphData(prev => {
      const updatedNodes = prev.nodes.filter(n => n.id !== id);
      const updatedEdges = prev.edges.filter(e => e.u !== id && e.v !== id);
      if (graphStartNodeId === id) setGraphStartNodeId(updatedNodes[0]?.id || 0);
      if (graphTargetNodeId === id) setGraphTargetNodeId(updatedNodes[updatedNodes.length - 1]?.id || 0);
      return { nodes: updatedNodes, edges: updatedEdges };
    });
    setStatusMsg(`Deleted vertex node ID ${id}`);
  };

  const handleAddUpdateGraphEdge = (u: number, v: number, w?: number) => {
    setGraphData(prev => {
      const edgesCopy = [...prev.edges];
      const matchIdx = edgesCopy.findIndex(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
      if (matchIdx >= 0) {
        edgesCopy[matchIdx] = { u, v, w };
      } else {
        edgesCopy.push({ u, v, w });
      }
      return { ...prev, edges: edgesCopy };
    });
    setStatusMsg(`Connected/updated edge between node ID ${u} and ${v} (w: ${w ?? 'none'})`);
  };

  const handleDeleteGraphEdge = (u: number, v: number) => {
    setGraphData(prev => {
      const updatedEdges = prev.edges.filter(e => !((e.u === u && e.v === v) || (e.u === v && e.v === u)));
      return { ...prev, edges: updatedEdges };
    });
    setStatusMsg(`Deleted edge connection between node ID ${u} and ${v}`);
  };

  // Re-generate snapshots when dependencies change
  useEffect(() => {
    if (activeAlgo) {
      generateSnapshots(activeAlgo);
    }
  }, [selectedAlgoId, generateSnapshots]);

  // Set up playback interval timer
  useEffect(() => {
    if (isPlaying) {
      setEngineStatus('RUNNING');
      timerRef.current = setInterval(() => {
        setStepIdx((prevIdx) => {
          if (prevIdx < steps.length - 1) {
            return prevIdx + 1;
          } else {
            setIsPlaying(false);
            setEngineStatus('PAUSED');
            if (timerRef.current) clearInterval(timerRef.current);
            return prevIdx;
          }
        });
      }, speedMs);
    } else {
      setEngineStatus('PAUSED');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speedMs, steps.length]);

  // Playback control callbacks
  const handlePlayToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIdx(0);
    setStatusMsg('Debugger playback simulation reset.');
  };

  const activeStep = steps[stepIdx] || {
    log: 'Idle.',
    vars: {},
    ops: 0,
    type: 'init',
  };

  const accumulatedLogs = steps
      .slice(0, stepIdx + 1)
      .map((s) => ({ ops: s.ops, log: s.log, type: s.type }));

  const activeLine = activeStep.vars && activeStep.vars.line !== undefined ? activeStep.vars.line : -1;

  const currentVisualizer = activeAlgo?.visualizer || 'array';

  return (
    <>
      {/* Top Bar Navigation */}
      <Header engineStatus={engineStatus} />

      {/* Main Workspace Workspace */}
      <main id="workspace">
        {/* Left panel browser */}
        <Sidebar selectedAlgoId={selectedAlgoId} onSelectAlgo={handleSelectAlgorithm} />

        {/* Center Panel canvas */}
        <section id="main-panel">
          <div className="panel-header">
            <h2 className="panel-title" id="panel-algo-name">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: '8px' }}
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              ALGORITHM PLAYBACK ENGINE: {activeAlgo?.name.toUpperCase() || 'IDLE'}
            </h2>
            <span
              className={`panel-status ${
                isPlaying
                  ? 'status-running'
                  : stepIdx === steps.length - 1 && steps.length > 1
                  ? 'status-done'
                  : 'status-paused'
              }`}
            >
              {isPlaying
                ? 'RUNNING'
                : stepIdx === steps.length - 1 && steps.length > 1
                ? 'COMPLETED'
                : 'PAUSED'}
            </span>
          </div>

          {/* Canvas Render Container */}
          <div id="viz-container">
            {currentVisualizer === 'array' && (
              <ArrayVisualizer array={activeStep.array || arrInput} step={activeStep} />
            )}

            {currentVisualizer === 'grid' && (
              <GridVisualizer
                grid={activeStep.grid || gridState}
                step={activeStep}
                startNode={startNode}
                endNode={endNode}
                onGridStateChange={(newGrid) => setGridState(newGrid)}
                onStartNodeChange={(coords) => setStartNode(coords)}
                onEndNodeChange={(coords) => setEndNode(coords)}
                onInteractionEnd={() => generateSnapshots(activeAlgo)}
              />
            )}

            {currentVisualizer === 'graph' && (
              <GraphVisualizer
                graph={activeStep.graph || graphData}
                step={activeStep}
                onGraphChange={(newGraph) => setGraphData(newGraph)}
              />
            )}

            {currentVisualizer === 'matrix' && (
              <MatrixVisualizer matrix={activeStep.matrix || { rows: [], cols: [], grid: [] }} step={activeStep} />
            )}

            {currentVisualizer === 'string' && (
              <StringVisualizer
                stringData={activeStep.string || { text: '', pattern: '' }}
                step={activeStep}
              />
            )}

            {currentVisualizer === 'math' && (
              <MathVisualizer
                mathData={activeStep.math || { mode: 'sieve' }}
                step={activeStep}
              />
            )}
          </div>

          {/* Simulation stats bar */}
          <div id="stats-bar">
            <div className="stat-box">
              <span className="stat-label">COMPUTED STEPS</span>
              <span className="stat-val">{activeStep.ops}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">DEBUGGING DEPTH</span>
              <span className="stat-val pink">
                {steps.length > 1 ? Math.floor((stepIdx / (steps.length - 1)) * 100) : 0}%
              </span>
            </div>
          </div>
        </section>

        {/* Right drawer dashboard controls */}
        <aside id="right-drawer">
          {/* Controls */}
          <PlaybackPanel
            isPlaying={isPlaying}
            stepIdx={stepIdx}
            totalSteps={steps.length}
            speedMs={speedMs}
            onPlayToggle={handlePlayToggle}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onReset={handleReset}
            onSpeedChange={(speed) => setSpeedMs(speed)}
          />

          {/* Dynamic input contexts parameters */}
          <DynamicInputs
            visualizer={currentVisualizer}
            selectedAlgoId={selectedAlgoId}
            arrInput={arrInput}
            onArrayChange={(arr) => {
              setArrInput(arr);
              setStatusMsg('Array inputs refreshed.');
            }}
            gcdA={gcdA}
            gcdB={gcdB}
            onGcdChange={(a, b) => {
              setGcdA(a);
              setGcdB(b);
              setStatusMsg(`GCD parameters set: A=${a}, B=${b}`);
            }}
            coinChangeAmount={coinChangeAmount}
            onCoinChangeAmountChange={(amount) => {
              setCoinChangeAmount(amount);
              setStatusMsg(`Coin Change target amount set to ${amount}`);
            }}
            onResizeGrid={resizeGridBoard}
            onClearWalls={clearActiveGridWalls}
            onGenerateRandomWalls={generateRandomGridWalls}
            graphNodes={graphData.nodes}
            graphStartNodeId={graphStartNodeId}
            graphTargetNodeId={graphTargetNodeId}
            onGraphStartChange={(id) => {
              setGraphStartNodeId(id);
              setStatusMsg(`Set graph start node ID to ${id}`);
            }}
            onGraphTargetChange={(id) => {
              setGraphTargetNodeId(id);
              setStatusMsg(`Set graph target node ID to ${id}`);
            }}
            onAddGraphNode={handleAddGraphNode}
            onDeleteGraphNode={handleDeleteGraphNode}
            onAddUpdateGraphEdge={handleAddUpdateGraphEdge}
            onDeleteGraphEdge={handleDeleteGraphEdge}
            knapsackWeights={knapsackWeights}
            knapsackValues={knapsackValues}
            knapsackCapacity={knapsackCapacity}
            onKnapsackChange={(w, v, c) => {
              setKnapsackWeights(w);
              setKnapsackValues(v);
              setKnapsackCapacity(c);
              setStatusMsg(`Knapsack settings updated: Capacity=${c}`);
            }}
            stringText={stringText}
            stringPattern={stringPattern}
            onStringChange={(txt, pat) => {
              setStringText(txt);
              setStringPattern(pat);
              setStatusMsg('KMP pattern text strings updated.');
            }}
            sieveLimit={sieveLimit}
            onSieveLimitChange={(limit) => {
              setSieveLimit(limit);
              setStatusMsg(`Sieve prime limit set to ${limit}`);
            }}
            hanoiDisks={hanoiDisks}
            onHanoiDisksChange={(disks) => {
              setHanoiDisks(disks);
              setStatusMsg(`Hanoi disks count set to ${disks}`);
            }}
            bstInsertVal={bstInsertVal}
            onBstInsertValChange={(val) => {
              setBstInsertVal(val);
              setStatusMsg(`BST node insertion value set to ${val}`);
            }}
          />

          {/* Code Sandbox Compilation IDE */}
          <CodeSandbox
            initialCode={customCode}
            activeLine={activeLine}
            onCompile={handleCompileCode}
          />

          {/* Active variable debug inspector */}
          <VariablesInspector vars={activeStep.vars || {}} />

          {/* Execution steps logger */}
          <LogsPanel logs={accumulatedLogs} />
        </aside>
      </main>

      {/* Footer bar branding */}
      <Footer statusMsg={statusMsg} />
    </>
  );
}
