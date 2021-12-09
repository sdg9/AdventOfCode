import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { Vector2 } from '../../utils/grid';
import { Grid } from '../../utils/grid2';

const input = readInput().split('\n');
const demoInput = readDemoInput().split('\n');

/* Functions */

function parse(values: string[]) {
  const parsed = values.map((row) => row.split('').map(Number));
  return new Grid(parsed);
}

function part1(values: string[]): number {
  const grid = parse(values);
  return grid.reduce((pos, val) => (val < Math.min(...grid.getNeighborValues(pos)) ? val + 1 : 0));
}

function getBasinPositions(
  grid: Grid<number>,
  position: Vector2,
  inBasin: Set<string> = new Set(),
  visited: Set<string> = new Set(),
) {
  const positionForSet = position.toString(); // use string set requires JS primitives
  if (grid.getVector(position) === undefined || grid.getVector(position) === 9 || visited.has(positionForSet)) {
    visited.add(positionForSet);
    return { visited, inBasin };
  } else {
    visited.add(positionForSet);
    inBasin.add(positionForSet);
    grid.getNeighborPositions(position).forEach((neighbor) => {
      const results = getBasinPositions(grid, neighbor, inBasin, visited);
      visited = results.visited;
      inBasin = results.inBasin;
    });
    return { visited, inBasin };
  }
}

function part2(values: string[]): number {
  const grid = parse(values);

  const lowPoints: Vector2[] = [];
  grid.forEach((pos, val) => {
    if (val < Math.min(...grid.getNeighborValues(pos))) {
      lowPoints.push(pos);
    }
  });

  const basinSizes = lowPoints.map((position) => getBasinPositions(grid, position).inBasin.size);
  const threeLargestBasins = basinSizes.sort((a, b) => b - a).slice(0, 3);
  return threeLargestBasins.reduce((a, b) => a * b);
}

/* Tests */

assert.strictEqual(part1(demoInput), 15);
assert.strictEqual(part1(input), 600);

assert.strictEqual(part2(demoInput), 1134);
assert.strictEqual(part2(input), 987840);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
