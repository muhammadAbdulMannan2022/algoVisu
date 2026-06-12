const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '../src/core/algorithms.ts');
const destDir = path.join(__dirname, '../src/core/algorithms');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const content = fs.readFileSync(srcFile, 'utf8');

// Parse helpers
const getTreeMockCode = `const getTreeMock = () => {
  const nodes = [
    { id: 1, label: '50 (Root)', x: 250, y: 50 },
    { id: 2, label: '30', x: 150, y: 110 },
    { id: 3, label: '70', x: 350, y: 110 },
    { id: 4, label: '20', x: 100, y: 170 },
    { id: 5, label: '40', x: 200, y: 170 },
    { id: 6, label: '60', x: 300, y: 170 },
    { id: 7, label: '80', x: 400, y: 170 }
  ];
  const edges = [
    { u: 1, v: 2 }, { u: 1, v: 3 },
    { u: 2, v: 4 }, { u: 2, v: 5 },
    { u: 3, v: 6 }, { u: 3, v: 7 }
  ];
  return { nodes, edges };
};`;

const getGraphMockCode = `const getGraphMock = () => {
  return {
    nodes: [
      { id: 0, label: 'A', x: 80, y: 150 },
      { id: 1, label: 'B', x: 200, y: 70 },
      { id: 2, label: 'C', x: 200, y: 230 },
      { id: 3, label: 'D', x: 340, y: 70 },
      { id: 4, label: 'E', x: 340, y: 230 },
      { id: 5, label: 'F', x: 450, y: 150 }
    ],
    edges: [
      { u: 0, v: 1, w: 4 }, { u: 0, v: 2, w: 2 },
      { u: 1, v: 2, w: 1 }, { u: 1, v: 3, w: 5 },
      { u: 2, v: 4, w: 8 }, { u: 3, v: 4, w: 2 },
      { u: 3, v: 5, w: 6 }, { u: 4, v: 5, w: 3 }
    ]
  };
};`;

// We find all instances of addAlgo(...)
let pos = 0;
const algosList = [];

while (true) {
  const index = content.indexOf('addAlgo(', pos);
  if (index === -1) break;

  // Let's find matching parenthesis
  let parenCount = 1;
  let endPos = index + 'addAlgo('.length;
  while (parenCount > 0 && endPos < content.length) {
    const char = content[endPos];
    if (char === '(') parenCount++;
    else if (char === ')') parenCount--;
    endPos++;
  }

  const addAlgoCall = content.substring(index, endPos);
  
  // Extract arguments inside addAlgo(...)
  // We parse the first argument (id)
  const idMatch = addAlgoCall.match(/addAlgo\(\s*['"]([^'"]+)['"]/);
  if (idMatch) {
    const id = idMatch[1];
    algosList.push({
      id,
      code: addAlgoCall
    });
  }
  
  pos = endPos;
}

console.log(`Found ${algosList.length} algorithms using addAlgo pattern.`);

// For each algorithm, let's write it to its own file!
const importedIds = [];

algosList.forEach((algo) => {
  const { id, code } = algo;
  
  // Clean up the addAlgo call and transform it to export const
  // addAlgo('id', 'name', 'category', 'complexity', 'space', 'visualizer', function* generator(...) { ... })
  // We can extract name, category, complexity, space, visualizer, and generator
  
  // Let's use regex to extract the parts or clean it up.
  // A clean way is to write the file as:
  /*
  import { Algorithm } from '../types';
  
  const generator = ...
  
  export const bubble: Algorithm = {
    id: 'bubble',
    name: 'Bubble Sort',
    ...
    generator,
    code: generator.toString()
  }
  */
  
  // Let's extract arguments:
  // We can find the commas. But commas can be inside nested brackets of generator.
  // So we can find the generator start (which is `function*` or `function` or `(arr...) =>`)
  const genStartIndex = code.search(/(function\*|\(\s*arr|\(\s*grid|\(\s*text|function\b)/);
  if (genStartIndex === -1) {
    console.error(`Could not find generator start for algorithm: ${id}`);
    return;
  }
  
  const metaPart = code.substring(0, genStartIndex);
  const genPart = code.substring(genStartIndex, code.length - 1); // remove closing paren of addAlgo(
  
  // Parse metadata from metaPart
  // addAlgo('id', 'name', 'category', 'complexity', 'space', 'visualizer',
  // Let's use backreferences to match outer quotes correctly even with inner quotes/apostrophes
  const metaRegex = /addAlgo\(\s*(['"])(.*?)\1\s*,\s*(['"])(.*?)\3\s*,\s*(['"])(.*?)\5\s*,\s*(['"])(.*?)\7\s*,\s*(['"])(.*?)\9\s*,\s*(['"])(.*?)\11\s*,/;
  const metaMatch = metaPart.match(metaRegex);
  if (!metaMatch) {
    console.error(`Could not match metadata for algorithm: ${id}`);
    return;
  }
  
  const algoId = metaMatch[2];
  const name = metaMatch[4].replace(/'/g, "\\'");
  const category = metaMatch[6];
  const complexity = metaMatch[8].replace(/'/g, "\\'");
  const space = metaMatch[10].replace(/'/g, "\\'");
  const visualizer = metaMatch[12];
  
  let finalFileContent = `import { Algorithm } from '../types';\n\n`;
  
  // Include helper codes if needed
  if (id === 'inorder' || id === 'preorder' || id === 'postorder') {
    finalFileContent += getTreeMockCode + '\n\n';
  }
  if (id === 'bfs' || id === 'dfs' || id === 'dijkstra') {
    finalFileContent += getGraphMockCode + '\n\n';
  }
  
  finalFileContent += `const generator = ${genPart};\n\n`;
  finalFileContent += `export const ${id}Algo: Algorithm = {\n`;
  finalFileContent += `  id: '${algoId}',\n`;
  finalFileContent += `  name: '${name}',\n`;
  finalFileContent += `  category: '${category}',\n`;
  finalFileContent += `  complexity: '${complexity}',\n`;
  finalFileContent += `  space: '${space}',\n`;
  finalFileContent += `  visualizer: '${visualizer}',\n`;
  finalFileContent += `  generator,\n`;
  finalFileContent += `  code: generator.toString()\n`;
  finalFileContent += `};\n`;
  
  fs.writeFileSync(path.join(destDir, `${id}.ts`), finalFileContent);
  importedIds.push(id);
});

// Let's generate the index.ts file inside algorithms/
let indexContent = `import { Algorithm } from '../types';\n`;
importedIds.forEach((id) => {
  indexContent += `import { ${id}Algo } from './${id}';\n`;
});

indexContent += `\nexport const ALGO_DATABASE: Record<string, Algorithm> = {\n`;
importedIds.forEach((id) => {
  indexContent += `  ${id}: ${id}Algo,\n`;
});
indexContent += `};\n`;

fs.writeFileSync(path.join(destDir, 'index.ts'), indexContent);

console.log(`Successfully generated ${importedIds.length} algorithm files + index.ts!`);
