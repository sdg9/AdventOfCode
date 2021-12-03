import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n').map(String);

/* Binary Tree */
export class TreeNode<T> {
  key: string;
  quantity: number;
  left: TreeNode<T>;
  right: TreeNode<T>;

  constructor(val: string) {
    this.key = val;
    this.quantity = 0;
    this.left = null;
    this.right = null;
  }

  hasChild() {
    return this.left != null || this.right != null;
  }

  depth() {
    const leftDepth = this.left?.depth() ?? 0;
    const rightDepth = this.right?.depth() ?? 0;
    return 1 + Math.max(0, leftDepth, rightDepth);
  }

  addChild(val: string) {
    if (val === '1') {
      if (this.right == null) this.right = new TreeNode(val);
      this.right.quantity += 1;
      return this.right;
    } else {
      if (this.left == null) this.left = new TreeNode(val);
      this.left.quantity += 1;
      return this.left;
    }
  }

  /**
   * Ties to the right
   * @returns
   */
  getPathMostTravelled<T>() {
    const oneMoreFrequent = this.right?.quantity >= this.left?.quantity;
    const oneDeepOrDeeper = this.right?.depth() >= this.left?.depth();

    const oneWins = (oneMoreFrequent && oneDeepOrDeeper) || this.left == null;
    const selfKey = this.key ?? '';
    const childKey = (oneWins ? this.right?.getPathMostTravelled() : this.left?.getPathMostTravelled()) ?? '';
    return selfKey + childKey;
  }
  /**
   * Ties to the left
   * @returns
   */
  getPathLeastTravelled<T>() {
    const zeroLessFrequent = this.left?.quantity <= this.right?.quantity;
    const zeroAsDeep = this.left?.depth() >= this.right?.depth();

    const zeroWins = (zeroLessFrequent && zeroAsDeep) || this.right == null;
    const selfKey = this.key ?? '';
    const childKey = (zeroWins ? this.left?.getPathLeastTravelled() : this.right?.getPathLeastTravelled()) ?? '';
    return selfKey + childKey;
  }
}

/**
 * Builds binary tree, root node is a placeholder, left is always 0 and right 1 (when not null)
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
