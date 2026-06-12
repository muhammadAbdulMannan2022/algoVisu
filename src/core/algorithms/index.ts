import { Algorithm } from '../types';
import { bubbleAlgo } from './bubble';
import { selectionAlgo } from './selection';
import { insertionAlgo } from './insertion';
import { mergeAlgo } from './merge';
import { quickAlgo } from './quick';
import { quickhoareAlgo } from './quickhoare';
import { heapAlgo } from './heap';
import { shellAlgo } from './shell';
import { cocktailAlgo } from './cocktail';
import { gnomeAlgo } from './gnome';
import { countingAlgo } from './counting';
import { oddevenAlgo } from './oddeven';
import { cycleAlgo } from './cycle';
import { bogoAlgo } from './bogo';
import { linearsearchAlgo } from './linearsearch';
import { binarysearchAlgo } from './binarysearch';
import { twosumAlgo } from './twosum';
import { kadaneAlgo } from './kadane';
import { dutchflagAlgo } from './dutchflag';
import { kmpAlgo } from './kmp';
import { bstinsertAlgo } from './bstinsert';
import { inorderAlgo } from './inorder';
import { preorderAlgo } from './preorder';
import { postorderAlgo } from './postorder';
import { bfsAlgo } from './bfs';
import { dfsAlgo } from './dfs';
import { dijkstraAlgo } from './dijkstra';
import { astarAlgo } from './astar';
import { bfsgridAlgo } from './bfsgrid';
import { dfsgridAlgo } from './dfsgrid';
import { dijkstragridAlgo } from './dijkstragrid';
import { gameoflifeAlgo } from './gameoflife';
import { hanoiAlgo } from './hanoi';
import { knapsackAlgo } from './knapsack';
import { lisAlgo } from './lis';
import { coinchangeAlgo } from './coinchange';
import { sieveAlgo } from './sieve';
import { gcdAlgo } from './gcd';
import { customsortAlgo } from './customsort';

export const ALGO_DATABASE: Record<string, Algorithm> = {
  bubble: bubbleAlgo,
  selection: selectionAlgo,
  insertion: insertionAlgo,
  merge: mergeAlgo,
  quick: quickAlgo,
  quickhoare: quickhoareAlgo,
  heap: heapAlgo,
  shell: shellAlgo,
  cocktail: cocktailAlgo,
  gnome: gnomeAlgo,
  counting: countingAlgo,
  oddeven: oddevenAlgo,
  cycle: cycleAlgo,
  bogo: bogoAlgo,
  linearsearch: linearsearchAlgo,
  binarysearch: binarysearchAlgo,
  twosum: twosumAlgo,
  kadane: kadaneAlgo,
  dutchflag: dutchflagAlgo,
  kmp: kmpAlgo,
  bstinsert: bstinsertAlgo,
  inorder: inorderAlgo,
  preorder: preorderAlgo,
  postorder: postorderAlgo,
  bfs: bfsAlgo,
  dfs: dfsAlgo,
  dijkstra: dijkstraAlgo,
  astar: astarAlgo,
  bfsgrid: bfsgridAlgo,
  dfsgrid: dfsgridAlgo,
  dijkstragrid: dijkstragridAlgo,
  gameoflife: gameoflifeAlgo,
  hanoi: hanoiAlgo,
  knapsack: knapsackAlgo,
  lis: lisAlgo,
  coinchange: coinchangeAlgo,
  sieve: sieveAlgo,
  gcd: gcdAlgo,
  customsort: customsortAlgo,
};
