export type AlgoCategory = 'all' | 'sort' | 'search' | 'grid' | 'graph' | 'lists' | 'dp' | 'math' | 'custom';

export type VisualizerType = 'array' | 'grid' | 'graph' | 'matrix' | 'string' | 'math';

export interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
  isObstacle?: boolean;
}

export interface GraphEdge {
  u: number;
  v: number;
  w?: number; // edge weight
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface MatrixData {
  rows: string[];
  cols: string[];
  grid: (number | null)[][];
}

export interface StringData {
  text: string;
  pattern: string;
}

export interface MathData {
  mode: 'sieve' | 'hanoi';
  primes?: Record<number, boolean>;
  max?: number;
  pegs?: number[][];
  totalDisks?: number;
}

export interface AlgoStep {
  array?: number[];
  grid?: string[][];
  gridState?: Array<{ r: number; c: number; type: string }>;
  graph?: GraphData;
  matrix?: MatrixData;
  string?: StringData;
  math?: MathData;
  log: string;
  vars: Record<string, any>;
  ops: number;
  type: string;
  i?: number;
  j?: number;
  index?: number;
  node?: number;
  u?: number;
  v?: number;
  r?: number;
  c?: number;
  state?: string;
  textIdx?: number;
  patIdx?: number;
  matches?: boolean;
  prime?: number;
}

export interface Algorithm {
  id: string;
  name: string;
  category: AlgoCategory;
  complexity: string;
  space: string;
  visualizer: VisualizerType;
  generator: (arr?: any, ...extraArgs: any[]) => Generator<any, any, any>;
  code: string;
  isCustom?: boolean;
}
