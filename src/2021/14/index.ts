import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { countItems } from '../../utils/array';
import { Graph, stringCompare, Node } from '../../utils/graph';
import { mergeAndSum } from '../../utils/map';

const rawInput = readInput();
const demoInput = readDemoInput();

/* Functions */
const parseInput = (values: string) => {
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

/**
 * Create directed graph based on insertion rules.
 * The rule AB -> C would create the node AB with neighbors [AC, CB]
 * @param insertionRules
 * @returns A directed graph of polymers
 */
const buildDirectedGraph = (insertionRules: { [key: string]: string }) => {
  const graph = new Graph<string>(stringCompare);
  Object.keys(insertionRules).forEach((key) => {
    const source = key;
    const leftNeighbor = `${key[0]}${insertionRules[key]}`;
    const rightNeighbor = `${insertionRules[key]}${key[1]}`;
    graph.addEdge(source, leftNeighbor, false);
    graph.addEdge(source, rightNeighbor, false);
  });
  return graph;
};

/**
 * Returns how many of each element will occur given the template, insertion rules, and iterations (steps)
 * @param template
 * @param insertionRules
 * @param steps
 * @returns
 */
function getElementCounts(template: string, insertionRules, steps: number) {
  const graph = buildDirectedGraph(insertionRules);

  let counts = template
    .split('')
    .slice(1)
    .reduce((map: { [key: string]: number }, char: string, idxPrior: number) => {
      const pair = `${template[idxPrior]}${char}`;
      return mergeAndSum(map, getElementsCountHelper(graph.nodes.get(pair), graph, steps));
    }, {});

  // remote duplicate counts of middle characters, as I iterate in pairs ABCD becomes AB, BC, CD so subtract BCD
  template
    .split('')
    .slice(1, -1)
    .forEach((char: string) => {
      counts[char] -= 1;
    });
  return counts;
}

/**
 * A memoized recursive lookup of the directed graph neighbors
 * @param node
 * @param graph
 * @param stepsRemaining
 * @param cache
 * @returns
 */
const getElementsCountHelper = (
  node: Node<string>,
  graph: Graph<string>,
  stepsRemaining: number,
  cache = new Map<string, { [key: string]: number }>(),
) => {
  const hash = JSON.stringify({ key: node.data, stepsRemaining });
  const cached = cache.get(hash);
  if (cached) {
    return cache.get(hash);
  } else {
    if (stepsRemaining === 0) {
      return countItems(node.data.split(''));
    } else {
      const retVal = node.adjacent.reduce(
        (map, n) => mergeAndSum(map, getElementsCountHelper(n, graph, stepsRemaining - 1, cache)),
        {},
      );

      // Since the relationship AB -> C is represented as adjacent nodes [AC, CB], when counting subtract 1 from the middle character
      const middleChar = node.adjacent[0].data[1];
      retVal[middleChar] -= 1;
      cache.set(hash, retVal);
      return retVal;
    }
  }
};

function part1And2(values: string, steps: number): number {
  const { template, insertionRules } = parseInput(values);
  const items = getElementCounts(template, insertionRules, steps);
  const maxKey = Object.keys(items).reduce((a, b) => (items[a] > items[b] ? a : b));
  const minKey = Object.keys(items).reduce((a, b) => (items[a] < items[b] ? a : b));
  return items[maxKey] - items[minKey];
}

/* Tests */

assert.strictEqual(part1And2(demoInput, 10), 1588);
assert.strictEqual(part1And2(demoInput, 40), 2188189693529);
assert.strictEqual(part1And2(rawInput, 0), 3);
assert.strictEqual(part1And2(rawInput, 10), 2408);
assert.strictEqual(part1And2(rawInput, 40), 2651311098752);
// /* Results */

console.time('Time');
const resultPart1 = part1And2(rawInput, 10);
const resultPart2 = part1And2(rawInput, 40);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
