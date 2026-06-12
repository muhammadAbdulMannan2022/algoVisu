import { Algorithm } from '../types';

const generator = function* kmpSearch(text = "AABAACAADAABAABA", pat = "AABA") {
  yield { type: 'initString', text, pattern: pat, log: 'Initialize KMP text matcher' };
  
  const n = text.length, m = pat.length;
  const lps = Array(m).fill(0);
  let len = 0, i = 1;
  while (i < m) {
    if (pat[i] === pat[len]) {
      len++; lps[i] = len; i++;
    } else {
      if (len !== 0) len = lps[len - 1];
      else { lps[i] = 0; i++; }
    }
  }
  
  i = 0; let j = 0;
  while (i < n) {
    yield { type: 'charMatch', textIdx: i, patIdx: j, matches: text[i] === pat[j], vars: { textIdx: i, patIdx: j, activeLps: lps[j] } };
    if (pat[j] === text[i]) {
      i++; j++;
    }
    if (j === m) {
      yield { type: 'matchFound', index: i - j, log: `MATCH FOUND AT INDEX ${i-j}!` };
      j = lps[j - 1];
    } else if (i < n && pat[j] !== text[i]) {
      if (j !== 0) j = lps[j - 1];
      else i++;
    }
  }
  yield { type: 'done' };
};

export const kmpAlgo: Algorithm = {
  id: 'kmp',
  name: 'KMP Pattern Search',
  category: 'search',
  complexity: 'O(n+m)',
  space: 'O(m)',
  visualizer: 'string',
  generator,
  code: generator.toString()
};
