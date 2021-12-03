import readInput from '../../utils/readInput';
import assert from 'assert';
import { BinaryString, TreeNode } from '../../utils/binaryTree';

const rawInput = readInput();
const input = rawInput.split('\n').map(String);

/* Functions */

const flipBit = (bit: number) => 1 - bit;

function part1(values: string[]): number {
  const binaryLength = values[0].length;
  const emptyBinaryLengthArray = Array.apply(null, Array(binaryLength));
  const gamma = emptyBinaryLengthArray.map((_, idx) => {
    const bitSummationAtIndex = values.reduce((summation, currentBit) => summation + parseInt(currentBit[idx], 2), 0);
    const mostFrequentBitAtIndex = Math.round(bitSummationAtIndex / values.length);
    return mostFrequentBitAtIndex;
  });

  const epsilon = gamma.map(flipBit);

  return parseInt(gamma.join(''), 2) * parseInt(epsilon.join(''), 2);
}

function part2(values: string[]): number {
  let root = new TreeNode().build(values);

  let o2Rating = root.getPathMostTravelled();
  let co2Rating = root.getPathLeastTravelled();

  return parseInt(o2Rating, 2) * parseInt(co2Rating, 2);
}

assert.strictEqual(part2(input), 3385170);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
