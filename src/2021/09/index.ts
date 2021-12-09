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
  if (grid.getVector(position) === undefined || grid.getVector(position) === 9 || visited.has(position.toString())) {
    visited.add(position.toString());
    return { visited, inBasin };
  } else {
    visited.add(position.toString());
    inBasin.add(position.toString());
    const neighbors = grid.getNeighborPositions(position);
    neighbors.forEach((neighbor) => {
      const results = getBasinPositions(grid, neighbor, inBasin, visited);
      visited = results.visited;
      inBasin = results.inBasin;
    });
    return { visited, inBasin };
  }
}
// function getBasinPositions(
//   grid: Grid<number>,
//   position: Vector2,
//   inBasin: Set<string> = new Set(),
//   visited: Set<string> = new Set(),
// ) {
//   if (visited.has(position.toString())) {
//     return { inBasin, visited };
//   }
//   inBasin.add(position.toString());
//   visited.add(position.toString());
//   const neighbors = grid.getNeighborPositions(position);
//   for (let neighbor of neighbors) {
//     const neighborValue = grid.getVector(neighbor);
//     if (neighborValue !== undefined && neighborValue !== 9 && !visited.has(neighbor.toString())) {
//       const results = getBasinPositions(grid, neighbor, inBasin, visited);
//       visited = results.visited;
//       inBasin = results.inBasin;
//     } else {
//       visited.add(neighbor.toString());
//     }
//   }
//   return { inBasin, visited };
// }

function part2(values: string[]): number {
  const grid = parse(values);

  // get low points
  const lowPoints: Vector2[] = [];

  grid.forEach((pos, val) => {
    if (val < Math.min(...grid.getNeighborValues(pos))) {
      lowPoints.push(pos);
    }
  });
  // grid.map((pos, val) => {
  //   // console.log(`Pos:, ${pos}, val: ${val}`);
  //   if (val < Math.min(...grid.getNeighborValues(pos))) {
  //     // console.log(`Low point at pos ${pos} with val ${val} ${grid.getNeighbors(pos)}`);
  //     // retVal += val + 1;
  //     lowPoints.push(pos);
  //   }
  //   return val;
  // });

  const basinSizes = lowPoints
    .map((position) => {
      // console.log(`===Get basin pos for ${position}`);
      const positions = getBasinPositions(grid, position);
      // console.log('Basin: ', positions.inBasin.size);
      return positions.inBasin.size;
    })
    .sort((a, b) => b - a);
  const threeLargest = basinSizes.slice(0, 3);
  return threeLargest.reduce((a, b) => a * b);
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
