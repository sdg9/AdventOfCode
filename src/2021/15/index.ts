import readInput from '../../utils/readInput';
import assert from 'assert';
import { Graph, astar } from '../../utils/astar';

const rawInput = readInput();

const parse = (input) => input.split('\n').map((line) => line.split('').map(Number));

/* Functions */

function part1(values: number[][]): number {
  const graph = new Graph(values);
  const start = graph.grid[0][0];
  const end = graph.grid[graph.grid.length - 1][graph.grid[0].length - 1];
  const result = astar.search(graph, start, end);

  const risk = result.reduce((sum, i) => sum + i.weight, 0);
  return risk;
}

function part2(values: number[]): number {
  return 0;
}

/* Tests */

const demo = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

assert.strictEqual(part1(parse(demo)), 40);

// assert.strictEqual(part2([1, -1]), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(parse(rawInput));
// const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
