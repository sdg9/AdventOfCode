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
  key: string;
  quantity: number;
  zero: TreeNode<T>;
  one: TreeNode<T>;

  constructor(val: string) {
    this.key = val;
    this.quantity = 0;
    this.zero = null;
    this.one = null;
  }

  hasChild() {
    return this.zero != null || this.one != null;
  }

  depth() {
    const leftDepth = this.zero?.depth() ?? 0;
    const rightDepth = this.one?.depth() ?? 0;
    return 1 + Math.max(0, leftDepth, rightDepth);
  }

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
   * Ties to the right
   * @returns
   */
  getPathMostTravelled<T>() {
    const oneMoreFrequent = this.one?.quantity >= this.zero?.quantity;
    const oneAsDeep = this.one?.depth() >= this.zero?.depth();

    const oneWins = (oneMoreFrequent && oneAsDeep) || this.zero == null;
    const selfKey = this.key ?? '';
    const childKey = (oneWins ? this.one?.getPathMostTravelled() : this.zero?.getPathMostTravelled()) ?? '';
    return selfKey + childKey;
  }
  /**
   * Ties to the left
   * @returns
   */
  getPathLeastTravelled<T>() {
    const zeroLessFrequent = this.zero?.quantity <= this.one?.quantity;
    const zeroAsDeep = this.zero?.depth() >= this.one?.depth();

    const zeroWins = (zeroLessFrequent && zeroAsDeep) || this.one == null;
    const selfKey = this.key ?? '';
    const childKey = (zeroWins ? this.zero?.getPathLeastTravelled() : this.one?.getPathLeastTravelled()) ?? '';
    return selfKey + childKey;
  }
}

/**
 * Builds binary tree where the root node doesn't represent a value (key is undefined)
 * @param values
 * @returns
 */
function buildTree(values: string[]) {
  let root = new TreeNode(undefined);
  values.forEach((value) => {
    let previousNode = root;
    value.split('').forEach((char, idx) => {
      previousNode = previousNode.addChild(char);
    });
  });
  return root;
}

/* Functions */

function part1(values: string[]): number {
  let gamma = '';
  let epsilon = '';
  for (let i = 0; i < values[0].length; i++) {
    let sum = 0;
    for (let j = 0; j < values.length; j++) {
      sum += parseInt(values[j][i], 10) === 1 ? 1 : -1;
    }
    const isOne = sum > 0;
    gamma += isOne ? '1' : '0';
    epsilon += isOne ? '0' : '1';
  }

  return parseInt(gamma, 2) * parseInt(epsilon, 2);
}

function part2(values: string[]): number {
  let root = buildTree(values);

  let o2Rating = root.getPathMostTravelled();
  let co2Rating = root.getPathLeastTravelled();

  return parseInt(o2Rating, 2) * parseInt(co2Rating, 2);
}

/* Tests */

assert.strictEqual(
  part1(['00100', '11110', '10110', '10111', '10101', '01111', '00111', '11100', '10000', '11001', '00010', '01010']),
  198,
);
assert.strictEqual(part1(input), 3882564);

assert.strictEqual(
  part2(['00100', '11110', '10110', '10111', '10101', '01111', '00111', '11100', '10000', '11001', '00010', '01010']),
  230,
);
assert.strictEqual(part2(input), 3385170);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
