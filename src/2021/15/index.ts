import readInput from '../../utils/readInput';
import assert from 'assert';
import { Graph, astar } from '../../utils/astar';

const rawInput = readInput();

const parse = (input: string) => input.split('\n').map((line) => line.split('').map(Number));

/* Functions */

function findLeastRiskyPathWeight(values: number[][]): number {
  const graph = new Graph(values);
  const start = graph.grid[0][0];
  const end = graph.grid[graph.grid.length - 1][graph.grid[0].length - 1];
  const result = astar.search(graph, start, end);

  return result.reduce((sum: number, i) => sum + i.weight, 0);
}

const getHigherLevelRisk = (max: number, base: number, increment: number) => ((base - 1 + increment) % max) + 1;

const getGrid5x = (values: number[][]): number[][] => {
  const lengthX = values[0].length;
  const lengthY = values.length;

  let retVal = [];
  for (let i = 0; i < lengthY * 5; i++) {
    retVal[i] = [];
  }

  for (let y = 0; y < lengthY; y++) {
    for (let x = 0; x < lengthX; x++) {
      for (let yMod = 0; yMod < 5; yMod++) {
        for (let xMod = 0; xMod < 5; xMod++) {
          retVal[y + yMod * lengthY][x + xMod * lengthX] = getHigherLevelRisk(9, values[y][x], yMod + xMod);
        }
      }
    }
  }
  return retVal;
};

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

assert.strictEqual(findLeastRiskyPathWeight(parse(demo)), 40);
assert.strictEqual(findLeastRiskyPathWeight(getGrid5x(parse(demo))), 315);

assert.strictEqual(findLeastRiskyPathWeight(parse(rawInput)), 755);
assert.strictEqual(findLeastRiskyPathWeight(getGrid5x(parse(rawInput))), 3016);
/* Results */

console.time('Time');
const resultPart1 = findLeastRiskyPathWeight(parse(rawInput));
const resultPart2 = findLeastRiskyPathWeight(getGrid5x(parse(rawInput)));
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
