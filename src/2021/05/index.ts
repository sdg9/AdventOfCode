import readInput from '../../utils/readInput';
import assert from 'assert';

// type Line = {
//   x1: number;
//   y1: number;
//   x2: number;
//   y2: number;
// };

const parseInput = (input: string) => {
  const values = input.split('\n').map((item) => item.split(' -> ').join(',').split(',').map(Number));
  //   console.log('Values: ', values);
  //   const [x1, y1, x2, y2] = values;
  //   const line: Line = { x1, y1, x2, y2 };
  //   return { x1, y1, x2, y2 };
  return values;
};

const rawInput = readInput();
const input = parseInput(rawInput);
const ascending = (a, b) => a - b;

/* Functions */
class Grid {
  values: number[][];

  constructor() {
    // this.values = values;
    this.values = [];
  }

  get(x: number, y: number): number {
    return this.values[y]?.[x];
  }

  drawLine(input: number[]) {
    const [x1, y1, x2, y2] = input;

    // can't do this unless horizontal/veritcal
    const [xMin, xMax] = [x1, x2].sort(ascending);
    const [yMin, yMax] = [y1, y2].sort(ascending);
    if (isHorizontalOrVertical(input)) {
      // horizontal
      for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
          if (!Array.isArray(this.values[y])) {
            this.values[y] = [];
          }
          // currently draws every step, not what we want (e.g 5,5 -> 8,2 draws a square, not a line)
          const point = this.values[y][x];
          this.values[y][x] = point == null ? 1 : point + 1;
        }
      }
    } else {
      // diagonal
      for (let i = 0; i <= xMax - xMin && i <= yMax - yMin; i++) {
        let x = x1 + i * Math.sign(x2 - x1);
        let y = y1 + i * Math.sign(y2 - y1);
        if (!Array.isArray(this.values[y])) {
          this.values[y] = [];
        }
        const point = this.values[y][x];
        this.values[y][x] = point == null ? 1 : point + 1;
      }
    }
  }

  toString() {
    let retVal = '';
    for (let row = 0; row < this.values.length; row++) {
      //   retVal[row] = [];
      retVal += '\n';
      for (let col = 0; col < this.values[row]?.length; col++) {
        // retVal[row][col] = col ? col : '.';
        const point = this.values[row][col];
        retVal += point ? point : '.';
      }
    }
    // const stringify = this.values.map((row) => {
    //   return row.map((col) => {
    //     return col ? col : '.';
    //   });
    // });
    // return `\n[${stringify.join('\n')}]`;
    // return `\n${retVal}`;
    return retVal;
    // return JSON.stringify(stringify);
    //     // return this.values;
    //     // this.values.map(col => {

    //     // })
    //     // console.log(JSON.stringify(this.values));
    //     // return 'hi';
    //     return JSON.stringify(this.values);
  }
}

const isHorizontalOrVertical = (input: number[]) => {
  const [x1, y1, x2, y2] = input;
  return x1 === x2 || y1 === y2;
};

function part1(lines: number[][]): number {
  let grid = new Grid();

  lines.forEach((line) => {
    if (isHorizontalOrVertical(line)) {
      //   console.log(line);
      grid.drawLine(line);
    }
  });

  const count = grid.values.reduce((totalSum, row) => {
    // return 1;
    return (
      totalSum +
      row.reduce((rowSum, col) => {
        return rowSum + (col > 1 ? 1 : 0);
      }, 0)
    );
  }, 0);
  //   console.log(`Grid Pt1: ${grid}`);
  return count;
}

function part2(lines: number[][]): number {
  let grid = new Grid();

  lines.forEach((line) => {
    grid.drawLine(line);
  });

  const count = grid.values.reduce((totalSum, row) => {
    // return 1;
    return (
      totalSum +
      row.reduce((rowSum, col) => {
        return rowSum + (col > 1 ? 1 : 0);
      }, 0)
    );
  }, 0);
  //   console.log(`Grid Pt2: ${grid}`);
  return count;
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
