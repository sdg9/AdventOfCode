import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { Vector2 } from '../../utils/grid';

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

  getNeighbors(position: Vector2) {
    const north = new Vector2(0, -1);
    const east = new Vector2(1, 0);
    const south = new Vector2(0, 1);
    const west = new Vector2(-1, 0);

    const neighbors = [
      this.getVector(position.add(north)),
      this.getVector(position.add(east)),
      this.getVector(position.add(south)),
      this.getVector(position.add(west)),
    ].filter((i) => i !== undefined);
    // console.log(neighbors);
    return neighbors;
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
    if (val < Math.min(...grid.getNeighbors(pos))) {
      // console.log(`Low point at pos ${pos} with val ${val} ${grid.getNeighbors(pos)}`);
      retVal += val + 1;
    }
    return val;
  });
  return retVal;
}

function part2(values: string[]): number {
  return 0;
}

/* Tests */

assert.strictEqual(part1(demoInput), 15);
// assert.strictEqual(part1([1, 1, 1]), 0);

// assert.strictEqual(part2([1, -1]), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
// const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
