import readInput from '../../utils/readInput';
import assert from 'assert';

const parseInput = (input: string) =>
  input.split('\n').map((item) => item.split(' -> ').join(',').split(',').map(Number));

const rawInput = readInput();
const input = parseInput(rawInput);

/* Functions */
const ascending = (a, b) => a - b;
const isHorizontalOrVertical = (input: number[]) => {
  const [x1, y1, x2, y2] = input;
  return x1 === x2 || y1 === y2;
};

class Grid {
  values: number[][];

  constructor() {
    this.values = [];
  }

  get(x: number, y: number): number {
    return this.values[y]?.[x];
  }

  increment(x: number, y: number) {
    if (!Array.isArray(this.values[y])) {
      this.values[y] = [];
    }
    this.values[y][x] = this.get(x, y) == null ? 1 : this.get(x, y) + 1;
  }

  inBounds(bounds1: number, bounds2: number, target: number) {
    const step = Math.sign(bounds2 - bounds1);
    return Math.abs(target * step) <= Math.abs(bounds2 - bounds1);
  }

  drawLine(input: number[]) {
    const [x1, y1, x2, y2] = input;

    const xStep = Math.sign(x2 - x1);
    const yStep = Math.sign(y2 - y1);

    for (let i = 0; this.inBounds(x1, x2, i * xStep) && this.inBounds(y1, y2, i * yStep); i++) {
      let x = x1 + i * xStep;
      let y = y1 + i * yStep;
      this.increment(x, y);
    }
  }

  getDuplicatePoints(value: number = 1) {
    return this.values.reduce(
      (totalOcurrences, row) =>
        totalOcurrences +
        row.reduce((rowOccurrences, col) => {
          return rowOccurrences + (col > value ? 1 : 0);
        }, 0),
      0,
    );
  }

  toString() {
    let retVal = '';
    for (let row = 0; row < this.values.length; row++) {
      retVal += '\n';
      for (let col = 0; col < this.values[row]?.length; col++) {
        const point = this.values[row][col];
        retVal += point ? point : '.';
      }
    }
    return retVal;
  }
}

function part1(lines: number[][]): number {
  let grid = new Grid();

  lines.forEach((line) => {
    if (isHorizontalOrVertical(line)) {
      grid.drawLine(line);
    }
  });
  return grid.getDuplicatePoints();
}

function part2(lines: number[][]): number {
  let grid = new Grid();

  lines.forEach((line) => {
    grid.drawLine(line);
  });

  return grid.getDuplicatePoints();
}

/* Tests */

const testData: string = `
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`;

assert.strictEqual(part1(parseInput(testData)), 5);
assert.strictEqual(part1(input), 8111);

assert.strictEqual(part2(parseInput(testData)), 12);
assert.strictEqual(part2(input), 22088);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
