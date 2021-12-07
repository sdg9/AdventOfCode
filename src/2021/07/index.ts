import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split(',').map(Number);

/* Functions */
const average = (array: number[]) => array.reduce((a, b) => a + b) / array.length;
const fuelCost = (array: number[], target: number) => array.reduce((a, b) => a + Math.abs(target - b), 0);

function part1(values: number[]): number {
  // // console.log('AV: ', average(values));
  const sorted = values.sort((a, b) => a - b);
  var half = Math.floor(values.length / 2);
  // console.log(sorted[half]);
  // // return 0;
  // // return sorted[half];
  return fuelCost(values, sorted[half]);
  // return fuelCost(values, 2);
}

function part2(values: number[]): number {
  return 0;
}

/* Tests */

assert.strictEqual(fuelCost([16, 1, 2, 0, 4, 2, 7, 1, 2, 14], 2), 37);
assert.strictEqual(part1([16, 1, 2, 0, 4, 2, 7, 1, 2, 14]), 37);

assert.strictEqual(part2([16, 1, 2, 0, 4, 2, 7, 1, 2, 14]), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
// const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
