import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n').map(String);

/* Functions */

function part1(values: string[]): number {
  let gamma = '';
  let epsilon = '';
  for (let i = 0; i < values[0].length; i++) {
    let sum = 0;
    for (let j = 0; j < values.length; j++) {
      sum += parseInt(values[j][i], 10) === 1 ? 1 : -1;
    }
    // console.log('Sum: ', sum);
    // const isOne = sum / 2 > values[0].length / 2;
    const isOne = sum >= 0;
    gamma += isOne ? '1' : '0';
    epsilon += isOne ? '0' : '1';
  }

  console.log('Gamma: ', gamma);
  console.log('Epsilon: ', epsilon);
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
}

export class TreeNode<T> {
  key: T;
  quantity: number;
  left: TreeNode<T>;
  right: TreeNode<T>;

  constructor(val: T) {
    this.key = val;
    this.quantity = 0;
    this.left = null;
    this.right = null;
  }

  hasChild() {
    return this.left != null || this.right != null;
  }

  depth() {
    // return 1 + Math.max(0, this.left?.depth(), this.right?.depth());
    const leftDepth = this.left?.depth() ?? 0;
    const rightDepth = this.right?.depth() ?? 0;
    return 1 + Math.max(0, leftDepth, rightDepth);
  }
}

function part2(values: string[]): number {
  const root = new TreeNode(undefined);
  values.forEach((value) => {
    let previousNode = root;
    value.split('').forEach((char, idx) => {
      let node = char === '1' ? previousNode.right : previousNode.left;
      if (node === null) {
        node = new TreeNode(char);
        if (char === '1') {
          previousNode.right = node;
        } else {
          previousNode.left = node;
        }
      }
      node.quantity += 1;
      previousNode = node;
    });
  });

  // Traverse tree

  // o2 rating = find most common, favoring 1 in tie
  let o2Rating = '';
  let currentNode = root;
  while (currentNode != null && currentNode.hasChild()) {
    const oneWins = currentNode.right?.quantity >= currentNode.left?.quantity || currentNode.left == null;
    if (oneWins) {
      o2Rating += currentNode.right?.key;
      currentNode = currentNode.right;
    } else {
      o2Rating += currentNode.left?.key;
      currentNode = currentNode.left;
    }
  }
  console.log('o2: ', o2Rating);

  // co2 scrubber rating = find least common, favoring 0 in tie
  let co2Rating = '';
  currentNode = root;
  console.log('Root depth: ', currentNode.depth());
  while (currentNode != null && currentNode.hasChild()) {
    console.log(
      `(0 qty: ${currentNode.left?.quantity} depth ${currentNode.left?.depth()}) vs (1 qty ${
        currentNode.right?.quantity
      } depth ${currentNode.right?.depth()})`,
    );
    const zeroWins =
      (currentNode.left?.quantity <= currentNode.right?.quantity &&
        currentNode.left?.depth() >= currentNode.right?.depth()) ||
      currentNode.right == null;
    // const oneWins = currentNode.right?.quantity >= currentNode.left?.quantity && currentNode.right.hasChild();
    if (zeroWins) {
      console.log('0 wins with depth ' + currentNode.depth());
      co2Rating += currentNode.left?.key;
      currentNode = currentNode.left;
    } else {
      console.log('1 wins with depth ' + currentNode.depth());
      co2Rating += currentNode.right?.key;
      currentNode = currentNode.right;
    }
  }

  // return o2 * co2

  //   console.log('Root: ', root);
  console.log('co2: ', co2Rating);
  // Build tree?
  return parseInt(o2Rating, 2) * parseInt(co2Rating, 2);
  //   return 0;
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
