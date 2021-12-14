import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { countItems } from '../../utils/array';
import { stringCompare } from '../../utils/graph';
import { mergeAndSum } from '../../utils/map';
import { memoize } from '../../utils/memoize';

const rawInput = readInput();
// const input = rawInput.split('\n').map(Number);
const demoInput = readDemoInput();

const parse = (values) => {
  let [template, pairInsertionRules] = values.split('\n\n');

  const insertionRules = pairInsertionRules
    .split('\n')
    .map((i) => i.split(' -> '))
    .reduce((map, i) => {
      map[i[0]] = i[1];
      return map;
    }, {});

  return {
    template,
    insertionRules,
  };
};

export class Node<T> {
  data: T;
  leftNode: Node<T>;
  rightNode: Node<T>;
  comparator: (a: T, b: T) => number;

  constructor(data: T, comparator: (a: T, b: T) => number) {
    this.data = data;
    // this.adjacent = [];
    this.comparator = comparator;
  }

  addLeftNode(node: Node<T>): void {
    this.leftNode = node;
  }
  addRightNode(node: Node<T>): void {
    this.rightNode = node;
  }
}

class DirectedGraph<T> {
  nodes: Map<T, Node<T>> = new Map();
  comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  /**
   * Add a new node if it was not added before
   *
   * @param {T} data
   * @returns {Node<T>}
   */
  addNode(data: T): Node<T> {
    let node = this.nodes.get(data);

    if (node) return node;

    node = new Node(data, this.comparator);
    this.nodes.set(data, node);

    return node;
  }

  /**
   * Create an edge between two nodes
   *
   * @param {T} source
   * @param {T} destination
   */
  addEdgeLeft(source: T, destination: T): void {
    const sourceNode = this.addNode(source);
    const destinationNode = this.addNode(destination);

    sourceNode.addLeftNode(destinationNode);
  }
  addEdgeRight(source: T, destination: T): void {
    const sourceNode = this.addNode(source);
    const destinationNode = this.addNode(destination);

    sourceNode.addRightNode(destinationNode);
  }
}

/* Functions */

function getPolymerNaive(values: string, steps = 5) {
  const { template, insertionRules } = parse(values);

  let currentTemplate: string = template;
  for (let i = 0; i < steps; i++) {
    let nextTemplate = '';
    currentTemplate.split('').forEach((c, idx, array) => {
      if (idx > 0) {
        const translation = insertionRules[`${array[idx - 1]}${c}`];
        nextTemplate += translation;
      }
      nextTemplate += c;
    });
    currentTemplate = nextTemplate;
  }
  return currentTemplate;
}

function part1ToMap(values: string, steps: number): { [key: string]: number } {
  const currentTemplate = getPolymerNaive(values, steps);
  const items = countItems(currentTemplate.split(''));
  return items;
}

function part2ToMap(values: string, steps: number): { [key: string]: number } {
  return getPolymer2(values, steps);
}

function part1(values: string, steps: number): number {
  const currentTemplate = getPolymerNaive(values, steps);

  console.log(`Template at ${steps} deep: ${currentTemplate}`);

  const items = countItems(currentTemplate.split(''));
  const maxKey = Object.keys(items).reduce((a, b) => (items[a] > items[b] ? a : b));
  const minKey = Object.keys(items).reduce((a, b) => (items[a] < items[b] ? a : b));

  return items[maxKey] - items[minKey];
}

const buildDirectedGraph = (insertionRules) => {
  const graph = new DirectedGraph<string>(stringCompare);
  Object.keys(insertionRules).forEach((key) => {
    const source = key;
    const leftNeighbor = `${key[0]}${insertionRules[key]}`;
    const rightNeighbor = `${insertionRules[key]}${key[1]}`;
    graph.addEdgeLeft(source, leftNeighbor);
    graph.addEdgeRight(source, rightNeighbor);
  });
  return graph;
};

const cache = new Map<string, { [key: string]: number }>();

const getLetterCounts = (input: string, testTemplate: string, depth: number) => {
  const { template, insertionRules } = parse(input);
  const graph = buildDirectedGraph(insertionRules);
  return getLetterCountsHelper(graph.nodes.get(testTemplate), graph, depth);
};
const getLetterCountsHelper = (node: Node<string>, graph: DirectedGraph<string>, depth: number) => {
  //   console.log(`Processing ${node.data}`);
  const hash = JSON.stringify({ key: node.data, depth });
  const cached = cache.get(hash);
  if (cached) {
    return cache.get(hash);
  } else {
    if (depth === 0) {
      return countItems(node.data.split(''));
    } else {
      //   const middleChar = node.adjacent[0].data[1];
      const middleChar = node.leftNode.data[1];
      //   console.log(`Middle char of ${node.data} is ${node.leftNode.data[1]}`);
      //   console.log(`Middle char of ${node.leftNode} and ${node.rightNode} is ...`);
      //   console.log(`Middle char of ${node.leftNode.data} and ${node.rightNode.data} is ${node.leftNode.data[1]}`);
      const retVal = [node.leftNode, node.rightNode].reduce(
        (map, n) => mergeAndSum(map, getLetterCountsHelper(n, graph, depth - 1)),
        {},
      );
      // Middle char counted twice with the above logic (since CH -> CB and BH, so subtract the middle char sum by 1)
      retVal[middleChar] -= 1;
      cache.set(hash, retVal);
      return retVal;
    }
  }
};

function getPolymer2(values: string, depth: number) {
  const { template, insertionRules } = parse(values);
  const graph = buildDirectedGraph(insertionRules);

  let total = {};
  template.split('').forEach((c, idx, array) => {
    if (idx > 0) {
      const pair = `${array[idx - 1]}${c}`;
      total = mergeAndSum(total, getLetterCountsHelper(graph.nodes.get(pair), graph, depth));
    }
  });

  // remote duplicate counts of middle
  template
    .split('')
    .slice(1, -1)
    .forEach((c) => {
      total[c] -= 1;
    });
  return total;
}

function part2(values: string, steps: number): number {
  const { template, insertionRules } = parse(values);
  const graph = buildDirectedGraph(insertionRules);
  const itemCounts = getPolymer2(values, steps);

  const maxKey = Object.keys(itemCounts).reduce((a, b) => (itemCounts[a] > itemCounts[b] ? a : b));
  const minKey = Object.keys(itemCounts).reduce((a, b) => (itemCounts[a] < itemCounts[b] ? a : b));

  return itemCounts[maxKey] - itemCounts[minKey];
}

/* Tests */

assert.strictEqual(getPolymerNaive(demoInput, 0), 'NNCB');
assert.strictEqual(getPolymerNaive(demoInput, 1), 'NCNBCHB');
assert.strictEqual(getPolymerNaive(demoInput, 2), 'NBCCNBBBCBHCB');
assert.strictEqual(getPolymerNaive(demoInput, 3), 'NBBBCNCCNBBNBNBBCHBHHBCHB');
assert.strictEqual(getPolymerNaive(demoInput, 4), 'NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB');

assert.strictEqual(getPolymerNaive(rawInput, 0), 'KHSNHFKVVSVPSCVHBHNP');
assert.strictEqual(getPolymerNaive(rawInput, 1), 'KNHCSNNVHSFPKPVSVBSOVHPCSCCSVNHHBBHPNFP');
assert.strictEqual(
  getPolymerNaive(rawInput, 2),
  'KSNVHOCSSNNKNSVNHCSPFNPFKBPKVBSOVPBKSOOPVNHHPOCSSCCBCSSOVHNVHFHHBCBBHHPKNHFNP',
);

// KHSNHFKVVSVPSCVHBHNP;
// K_H_S_N_H_F_K_V_V_S_V_P_S_C_V_H_B_H_N_P;

const depth4Length = getPolymerNaive(rawInput, 4).length;
const isValidLength = (templateLength: number, depth: number, expected: number) =>
  expected === templateLength * Math.pow(2, depth) - Math.pow(2, depth) + 1;

// assert.strictEqual(isValidLength(20, 0, getPolymerNaive(rawInput, 0).length), true);
// assert.strictEqual(isValidLength(20, 1, getPolymerNaive(rawInput, 1).length), true);
// assert.strictEqual(isValidLength(20, 2, getPolymerNaive(rawInput, 2).length), true);
// assert.strictEqual(isValidLength(20, 3, getPolymerNaive(rawInput, 3).length), true);
// assert.strictEqual(isValidLength(20, 4, getPolymerNaive(rawInput, 4).length), true);
// assert.strictEqual(getPolymerNaive(rawInput, 0).length, 20);
// assert.strictEqual(getPolymerNaive(rawInput, 1).length, 20 * 2 - 1);
// assert.strictEqual(getPolymerNaive(rawInput, 2).length, 20 * Math.pow(2, 2) - Math.pow(2, 2) + 1);
// assert.strictEqual(getPolymerNaive(rawInput, 3).length, 20 * Math.pow(2, 3) - Math.pow(2, 3) + 1);
// assert.strictEqual(getPolymerNaive(rawInput, 4).length, 20 * Math.pow(2, 4) - Math.pow(2, 4) + 1);
// assert.strictEqual(getPolymerNaive(rawInput, 4).length, 20 * Math.pow(2, 4) - Math.pow(2, 4) + 1);

// assert.deepStrictEqual(getLetterCounts(demoInput, 'CH', 0), { C: 1, H: 1 });
// assert.deepStrictEqual(getLetterCounts(demoInput, 'CH', 1), { C: 1, B: 1, H: 1 });
// assert.deepStrictEqual(getLetterCounts(demoInput, 'CH', 2), { C: 1, B: 1, H: 3 });

// assert.strictEqual(part1(demoInput, 10), 1588);
// // assert.strictEqual(
// //   isValidLength(getPolymerNaive(demoInput, 0).length, 10, getPolymerNaive(demoInput, 10).length),
// //   true,
// // );
// assert.strictEqual(part2(demoInput, 10), 1588);
// assert.strictEqual(part2(demoInput, 40), 2188189693529);

// assert.strictEqual(part1(rawInput, 0), 3);
// assert.strictEqual(part2(rawInput, 0), 3);

// assert.deepStrictEqual(part1ToMap(demoInput, 0), { N: 2, C: 1, B: 1 });
// assert.deepStrictEqual(part2ToMap(demoInput, 0), { N: 2, C: 1, B: 1 });
// assert.deepStrictEqual(part1ToMap(demoInput, 0), part2ToMap(demoInput, 0));
// assert.deepStrictEqual(part1ToMap(demoInput, 10), part2ToMap(demoInput, 10));
// assert.deepStrictEqual(part1ToMap(demoInput, 15), part2ToMap(demoInput, 15));

// assert.deepStrictEqual(part1ToMap(rawInput, 0), part2ToMap(rawInput, 0));

// // 0: KHSNHFKVVSVPSCVHBHNP
// // 1: KNHCSNNVHSFPKPVSVBSOVHPCSCCSVNHHBBHPNFP
// // 2: KSNVHOCSSNNKNSVNHCSPFNPFKBPKVBSOVPBKSOOPVNHHPOCSSCCBCSSOVHNVHFHHBCBBHHPKNHFNP
// assert.deepStrictEqual(part1ToMap(rawInput, 1), { B: 3, C: 4, F: 2, H: 6, K: 2, N: 5, O: 1, P: 5, S: 6, V: 5 });

// // console.log(Object.values(part1ToMap(rawInput, 1)));
// assert.strictEqual(
//   Object.values(part1ToMap(rawInput, 0)).reduce((a, b) => a + b),
//   20,
// );
// assert.strictEqual(
//   Object.values(part2ToMap(rawInput, 0)).reduce((a, b) => a + b),
//   20,
// );
// assert.strictEqual(
//   Object.values(part1ToMap(rawInput, 1)).reduce((a, b) => a + b),
//   39,
// );
// assert.strictEqual(
//   Object.values(part2ToMap(rawInput, 1)).reduce((a, b) => a + b),
//   39,
// );

// assert.deepStrictEqual(part2ToMap(rawInput, 1), part1ToMap(rawInput, 1));
// assert.deepStrictEqual(part1ToMap(rawInput, 1), part2ToMap(rawInput, 1));

// assert.strictEqual(part1(rawInput, 1), 5);
// assert.strictEqual(part2(rawInput, 1), 5);

// assert.strictEqual(part1(rawInput, 10), 2408);
// assert.strictEqual(part2(rawInput, 10), 2408);
// /* Results */

// console.time('Time');
// const resultPart1 = part1(rawInput, 10);
const resultPart2 = part2(rawInput, 40);
// console.timeEnd('Time');

// console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2); // Too high 11391520179783
