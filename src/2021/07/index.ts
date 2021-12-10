import readInput from '../../utils/readInput';
import assert from 'assert';
import { curry } from '../../utils/curry';
import { average, median, nthTriangle } from '../../utils/math';

const rawInput = readInput();
const input = rawInput.split(',').map(Number);

/* Functions */
const fuelCost = (array: number[], target: number) => array.reduce((a, b) => a + Math.abs(target - b), 0);
const fuelCostNthTriangle = (array: number[], target: number) =>
  array.reduce((a, b) => a + nthTriangle(Math.abs(target - b)), 0);
const curriedCostPt2 = curry(fuelCostNthTriangle);

function part1(values: number[]): number {
  return fuelCost(values, median(values));
}

function part2(values: number[]): number {
  const avg = average(values);
  const floorAndCeilAverageCosts = [Math.floor(avg), Math.ceil(avg)].map(curriedCostPt2(values));
  return Math.min(...floorAndCeilAverageCosts);
}

/* Tests */

assert.strictEqual(fuelCost([16, 1, 2, 0, 4, 2, 7, 1, 2, 14], 2), 37);
assert.strictEqual(part1([16, 1, 2, 0, 4, 2, 7, 1, 2, 14]), 37);
assert.strictEqual(part1(input), 343605);

assert.strictEqual(fuelCostNthTriangle([16], 5), 66);
assert.strictEqual(fuelCostNthTriangle([1], 5), 10);
assert.strictEqual(fuelCostNthTriangle([2], 5), 6);
assert.strictEqual(fuelCostNthTriangle([16, 1, 2, 0, 4, 2, 7, 1, 2, 14], 5), 168);
assert.strictEqual(part2([16, 1, 2, 0, 4, 2, 7, 1, 2, 14]), 168);
assert.strictEqual(part2(input), 96744904);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
