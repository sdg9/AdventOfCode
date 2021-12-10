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
let points2 = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
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

const completeChunk = (line: string) => {
  let chunk: string[] = [];
  line.split('').forEach((c) => {
    if (open.includes(c)) {
      chunk.push(c);
    } else if (properClose[chunk[chunk.length - 1]] === c) {
      chunk.pop();
    }
  });

  // Unwind Chunk

  const finishChunk = chunk
    .reverse()
    .map((i) => properClose[i])
    .join('');
  //   console.log(finishChunk);
  return finishChunk;
};

const scoreString = (input: string) => {
  return input.split('').reduce((acc, v) => {
    return acc * 5 + points2[v];
  }, 0);
};

const median = (array: number[]) => {
  const sorted = array.sort((a, b) => a - b);
  const half = Math.floor(array.length / 2);
  return sorted[half];
};
function part2(values: string[]): number {
  let incomplete: string[] = [];
  values.forEach((line) => {
    let invalidChar = processChunks(line);
    if (invalidChar === undefined) {
      incomplete.push(line);
    }
  });
  //   console.log('Incompelte', incomplete);
  let retVal = [];
  incomplete.forEach((line) => {
    let finish = completeChunk(line);
    const score = scoreString(finish);
    // console.log(`Finish: ${finish} with score ${score}`);
    retVal.push(score);
  });
  return median(retVal);
}

/* Tests */

assert.strictEqual(part1(demoInput), 26397);
assert.strictEqual(part1(input), 362271);

assert.strictEqual(part2(demoInput), 288957);
assert.strictEqual(part2(input), 1698395182);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
// const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
