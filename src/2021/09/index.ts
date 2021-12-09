import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { Vector2 } from '../../utils/grid';
// const { Set } = require('immutable');

const input = readInput().split('\n');
const demoInput = readDemoInput().split('\n');

/* Functions */

export class Grid<T> {
  values: T[][];

  constructor(values: T[][]) {
    this.values = values;
  }

  map(cb: (position: Vector2, value: T) => T): T[][] {
    return this.values.map((rowValue, y) => {
      return rowValue.map((colValue, x) => {
        return cb(new Vector2(x, y), colValue);
      });
    });
  }

  getVector(position: Vector2): T {
    return this.values?.[position.y]?.[position.x];
  }

  getNeighborPositions(position: Vector2): Vector2[] {
    const north = new Vector2(0, -1);
    const east = new Vector2(1, 0);
    const south = new Vector2(0, 1);
    const west = new Vector2(-1, 0);
    return [position.add(north), position.add(east), position.add(south), position.add(west)];
  }

  getNeighborValues(position: Vector2) {
    return this.getNeighborPositions(position)
      .map((i) => this.getVector(i))
      .filter((i) => i !== undefined);
  }
}

function parse(values: string[]) {
  const parsed = values.map((row) => row.split('').map(Number));
  return new Grid(parsed);
}

function part1(values: string[]): number {
  const grid = parse(values);
  // grid.getNeighbors(new Vector2(0, 0));
  let retVal = 0;
  grid.map((pos, val) => {
    // console.log(`Pos:, ${pos}, val: ${val}`);
    if (val < Math.min(...grid.getNeighborValues(pos))) {
      // console.log(`Low point at pos ${pos} with val ${val} ${grid.getNeighbors(pos)}`);
      retVal += val + 1;
    }
    return val;
  });
  return retVal;
}

// function getBasinPositions(
//   grid: Grid<number>,
//   position: Vector2,
//   inBasin: Set<Vector2> = new Set(),
//   visited: Set<Vector2> = new Set(),
// ) {
//   console.log(`Get basin pos for ${position} with visited:`, visited);
//   if (grid.getVector(position) === undefined || grid.getVector(position) === 9 || visited.has(position)) {
//     visited.add(position);
//     return { visited, inBasin };
//   } else {
//     visited.add(position);
//     console.log(`  Adding pos ${position}`);
//     inBasin.add(position);
//     const neighbors = grid.getNeighborPositions(position);
//     neighbors.forEach((neighbor) => {
//       const results = getBasinPositions(grid, neighbor, inBasin, visited);
//       visited = results.visited;
//       inBasin = results.inBasin;
//     });
//   }
// }
function getBasinPositions(
  grid: Grid<number>,
  position: Vector2,
  inBasin: Set<string> = new Set(),
  visited: Set<string> = new Set(),
) {
  if (visited.has(position.toString())) {
    return { inBasin, visited };
  }
  // console.log(`Checking pos ${position}`);
  inBasin.add(position.toString());
  visited.add(position.toString());
  const neighbors = grid.getNeighborPositions(position);
  for (let neighbor of neighbors) {
    const neighborValue = grid.getVector(neighbor);
    // console.log(` Checking value ${neighborValue} at position ${neighbor}`);
    if (neighborValue !== undefined && neighborValue !== 9 && !visited.has(neighbor.toString())) {
      // visit
      const results = getBasinPositions(grid, neighbor, inBasin, visited);
      visited = results.visited;
      inBasin = results.inBasin;
      // visited = new Set([...visited, ...results.visited]);
      // inBasin = new Set([...inBasin, ...results.inBasin]);
    } else {
      visited.add(neighbor.toString());
    }
  }
  // neighbors.forEach((neighbor) => {
  //   const neighborValue = grid.getVector(neighbor);
  //   if (neighborValue !== undefined && neighborValue !== 9 && !visited.has(neighbor)) {
  //     // visit
  //     const results = getBasinPositions(grid, neighbor, visited);
  //     visited = new Set([...visited, ...results.visited]);
  //     inBasin = new Set([...inBasin, ...results.inBasin]);
  //   } else {
  //     visited.add(neighbor);
  //   }
  // });
  return { inBasin, visited };
}

function part2(values: string[]): number {
  const grid = parse(values);

  // get low points
  const lowPoints: Vector2[] = [];
  grid.map((pos, val) => {
    // console.log(`Pos:, ${pos}, val: ${val}`);
    if (val < Math.min(...grid.getNeighborValues(pos))) {
      // console.log(`Low point at pos ${pos} with val ${val} ${grid.getNeighbors(pos)}`);
      // retVal += val + 1;
      lowPoints.push(pos);
    }
    return val;
  });

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
