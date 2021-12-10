import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');
const demoInput = readDemoInput().split('\n');

/* Functions */

let open = '([{<';
let close = ')]}>';

let properClose = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};
let points = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
  undefined: 0,
};

const processChunks = (line: string) => {
  let chunk: string[] = [];
  let invalidCharacter = undefined;
  line.split('').some((c) => {
    if (open.includes(c)) {
      chunk.push(c);
      return false;
    } else if (properClose[chunk[chunk.length - 1]] === c) {
      chunk.pop();
      return false;
    } else {
      invalidCharacter = c;
      //   console.log(`Invalid char ${c} in line: ${line}`);
      return true;
    }
  });
  //   console.log(`Invalid char ${invalidCharacter}`);
  return invalidCharacter;
};

function part1(values: string[]): number {
  //   console.log(demoInput);
  let retVal = 0;
  values.forEach((line) => {
    let invalidChar = processChunks(line);
    retVal += points[invalidChar];
  });
  return retVal;
}

function part2(values: string[]): number {
  return 0;
}

/* Tests */

assert.strictEqual(part1(demoInput), 26397);
assert.strictEqual(part1(input), 362271);

// assert.strictEqual(part2([1, -1]), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
// const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
