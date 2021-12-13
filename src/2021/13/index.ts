import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { Vector2, directions, Direction } from '../../utils/grid';
import { tail } from '../../utils/array';

const rawInput = readInput();
const demoInput = readDemoInput();

const parse = (values) => {
  let [numbersInput, foldInput] = values.split('\n\n');
  const positions: Vector2[] = numbersInput
    .split('\n')
    .map((i) => i.split(','))
    .map((i) => new Vector2(+i[0], +i[1]));
  const folds: Vector2[] = foldInput.split('\n').map((i) => {
    const [xOrY, value] = tail(i.split(' ')).split('=');
    return new Vector2(xOrY === 'x' ? +value : 0, xOrY === 'y' ? +value : 0);
  });

  return {
    positions,
    folds,
  };
};

const fold = (positions: Vector2[], fold: Vector2) => {
  const folded = positions.map((pos) => {
    if (fold.y !== 0) {
      if (pos.y > fold.y) {
        const distance = pos.y - fold.y;
        pos.y = fold.y - distance;
      }
    } else if (fold.x !== 0) {
      if (pos.x > fold.x) {
        const distance = pos.x - fold.x;
        pos.x = fold.x - distance;
      }
    }
    return pos;
  });

  // Deduplicate
  return Array.from(new Set([...folded.map((i) => `${i.x},${i.y}`)])).map((i) => {
    const [x, y] = i.split(',');
    return new Vector2(+x, +y);
  });
};

/* Functions */
function part1(values: string): number {
  let { positions, folds } = parse(values);
  positions = fold(positions, folds[0]);
  return positions.length;
}

function prettyPrint(positions: Vector2[]) {
  const maxX = Math.max(...positions.map((i) => i.x));
  const maxY = Math.max(...positions.map((i) => i.y));
  const grid = [];
  for (let y = 0; y <= maxY; y++) {
    grid[y] = [];
    for (let x = 0; x <= maxX; x++) {
      grid[y][x] = '.';
    }
  }

  positions.forEach((pos) => {
    grid[pos.y][pos.x] = '#';
  });

  let buffer = '';
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      buffer += grid[y][x];
    }
    buffer += '\n';
  }

  return buffer;
}

function part2(values: string): void {
  let { positions, folds } = parse(values);

  folds.forEach((f) => {
    positions = fold(positions, f);
  });
  console.log(prettyPrint(positions));
}

/* Tests */

assert.strictEqual(part1(demoInput), 17);
assert.strictEqual(part1(rawInput), 802);

/* Results */

console.time('Time');
const resultPart1 = part1(rawInput);
part2(rawInput);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
