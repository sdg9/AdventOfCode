import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { Graph, Node, Queue } from '../../utils/graph';
import { countItems, findDuplicates, tail } from '../../utils/array';

const rawInput = readInput();
const input = rawInput.split('\n');
const demoInput = readDemoInput().split('\n');

const stringCompare = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
/* Functions */
function parse(lines: string[]) {
  const g = new Graph<string>(stringCompare);
  lines.forEach((line) => {
    const [a, b] = line.split('-');
    g.addEdge(a, b);
  });
  return g;
}

function isLowerCase(myString: string) {
  return myString == myString.toLowerCase();
}

function findPathsToEnd(graph: Graph<string>) {
  const startNode = graph.nodes.get('start');
  const endNode = graph.nodes.get('end');

  const pendingPaths: Queue<Node<string>[]> = new Queue();
  const finalizedPaths: Node<string>[][] = [];
  pendingPaths.add([startNode]);

  while (!pendingPaths.isEmpty()) {
    const path = pendingPaths.remove();
    tail(path).adjacent.forEach((node: Node<string>) => {
      if (node === endNode) {
        finalizedPaths.push([...path, node]);
      } else if (isLowerCase(node.data) && path.includes(node)) {
        // don't repeat lowercase nodes
      } else {
        pendingPaths.add([...path, node]);
      }
    });
  }
  return finalizedPaths;
}

function isInvalidCaveRentry(node: Node<string>, path: Node<string>[]) {
  const isStart = node.data === 'start';
  const isLowerCase = node.data == node.data.toLowerCase();
  if (isStart) {
    return true;
  } else if (isLowerCase) {
    const onlyLowerCase = path.map((i) => i.data).filter((i) => i === i.toLowerCase());
    const existingDuplicates = findDuplicates(countItems(onlyLowerCase));
    // Allow another instance of lowercase as long as there are no other dupicates
    return path.includes(node) && existingDuplicates.length > 0;
  }
  return false;
}

function findPathsToEndPt2(graph: Graph<string>) {
  const startNode = graph.nodes.get('start');
  const endNode = graph.nodes.get('end');

  const pendingPaths: Queue<Node<string>[]> = new Queue();
  const finalizedPaths: Node<string>[][] = [];
  pendingPaths.add([startNode]);

  while (!pendingPaths.isEmpty()) {
    const path = pendingPaths.remove();
    tail(path).adjacent.forEach((node: Node<string>) => {
      if (node === endNode) {
        finalizedPaths.push([...path, node]);
      } else if (isInvalidCaveRentry(node, path)) {
        // don't repeat lowercase nodes
      } else {
        pendingPaths.add([...path, node]);
      }
    });
  }
  return finalizedPaths;
}

function part1(values: string[]): number {
  const graph = parse(values);
  const validPaths = findPathsToEnd(graph);
  return validPaths.length;
}

function part2(values: string[]): number {
  const graph = parse(values);
  const validPaths = findPathsToEndPt2(graph);
  //   console.log(validPaths.map((i) => i.map((j) => j.data)));
  return validPaths.length;
}

/* Tests */
assert.strictEqual(part2(demoInput), 36);

assert.strictEqual(part1(demoInput), 10);
assert.strictEqual(
  part1(['dc-end', 'HN-start', 'start-kj', 'dc-start', 'dc-HN', 'LN-dc', 'HN-end', 'kj-sa', 'kj-HN', 'kj-dc']),
  19,
);
assert.strictEqual(part1(input), 5756);

assert.deepStrictEqual(countItems(['a', 'b', 'c', 'a']), { a: 2, b: 1, c: 1 });
assert.deepStrictEqual(findDuplicates(countItems(['a', 'b', 'c', 'a'])), ['a']);
assert.deepStrictEqual(findDuplicates(countItems(['a', 'b', 'c'])), []);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
console.timeEnd('Time');
console.log('Solution to part 1:', resultPart1);

console.time('Time');
const resultPart2 = part2(input);
console.timeEnd('Time');
console.log('Solution to part 2:', resultPart2); // Not 39461
