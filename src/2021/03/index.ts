import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n').map(String);

/**
 * Binary tree of a binary number
 * instead of the typical this.left and this.right for a binary tree I just use this.zero
 * and this.one respectively.
 * While somewhat redundant child nodes named zero will have a key of '0' and one a key of '1'
 */
export class TreeNode<T> {
  value: string;
  quantity: number;
  zero: TreeNode<T>;
  one: TreeNode<T>;

  constructor(val?: string) {
    this.value = val;
    this.quantity = 0;
    this.zero = null;
    this.one = null;
  }

  getValueString() {
    return this.value ?? '';
  }

  hasChild() {
    return this.zero != null || this.one != null;
  }

  depth() {
    const leftDepth = this.zero?.depth() ?? 0;
    const rightDepth = this.one?.depth() ?? 0;
    return 1 + Math.max(0, leftDepth, rightDepth);
  }

  /**
   *
   * @param val String of length 1
   * @returns
   */
  addChild(val: string) {
    if (val === '1') {
      if (this.one == null) this.one = new TreeNode(val);
      this.one.quantity += 1;
      return this.one;
    } else {
      if (this.zero == null) this.zero = new TreeNode(val);
      this.zero.quantity += 1;
      return this.zero;
    }
  }
  /**
   *
   * @param val String of any length
   */
  addChildren(val: string) {
    if (val.length === 0) {
      return;
    }
    const node = this.addChild(val[0]);
    node.addChildren(val.slice(1));
  }

  /**
   * Ties to the right
   * @returns
   */
  getPathMostTravelled<T>() {
    const oneMoreFrequent = this.one?.quantity >= this.zero?.quantity;
    const isOneDeadEnd = this.one?.depth() < this.zero?.depth();

    const oneWins = oneMoreFrequent && !isOneDeadEnd;
    const childValues = (oneWins ? this.one?.getPathMostTravelled() : this.zero?.getPathMostTravelled()) ?? '';
    return this.getValueString() + childValues;
  }
  /**
   * Ties to the left
   * @returns
   */
  getPathLeastTravelled<T>() {
    const zeroLessFrequent = this.zero?.quantity <= this.one?.quantity;
    const isZeroDeadEnd = this.zero?.depth() < this.one?.depth();

    const zeroWins = (zeroLessFrequent && !isZeroDeadEnd) || this.one == null;
    const childValues = (zeroWins ? this.zero?.getPathLeastTravelled() : this.one?.getPathLeastTravelled()) ?? '';
    return this.getValueString() + childValues;
  }

  build(values: string[]) {
    values.forEach((value) => {
      this.addChildren(value);
    });
    return this;
  }
}

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
