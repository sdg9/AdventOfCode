import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { median } from '../../utils/math';
import { sum, tail } from '../../utils/array';

const rawInput = readInput();
const input = rawInput.split('\n');
const demoInput = readDemoInput().split('\n');

/* Functions */
let openChars = '([{<';
let closeChars = ')]}>';

const getKey = (map, key) => map[key];
const closeCharMap = { '(': ')', '[': ']', '{': '}', '<': '>' };
const part1Points = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const part2Points = { ')': 1, ']': 2, '}': 3, '>': 4 };

const getChunkCloseCharacter = (openCharacter: string) => getKey(closeCharMap, openCharacter);
const isChunkCloseCharacter = (closeChar, openChar) => getChunkCloseCharacter(openChar) === closeChar;

let getPointsPart1 = (closeChar: string) => getKey(part1Points, closeChar) ?? 0;
let getPointsPart2 = (closeChar: string) => getKey(part2Points, closeChar);
const scoreString = (input: string) => {
  return input
    .split('')
    .map(getPointsPart2)
    .reduce((acc, points) => acc * 5 + points);
};

/**
 * Finds first invalid character of a line (if there is one)
 * @param line
 * @returns The first invalid character of a line, returns undefined if no invalid characters.
 */
const firstSyntaxBreakingCharacter = (line: string) => {
  let chunks: string[] = [];
  let invalidCharacter = undefined;
  line.split('').some((c) => {
    let isValidOpeningCharacter = openChars.includes(c);
    if (isValidOpeningCharacter) {
      chunks.push(c);
    } else if (isChunkCloseCharacter(c, tail(chunks))) {
      chunks.pop();
    } else {
      invalidCharacter = c;
    }
    return invalidCharacter != undefined;
  });
  return invalidCharacter;
};

/**
 * Completes an unfinished line.
 * @param line
 * @returns The valid characters to complete an incomplete line.
 */
const getLineFinishingCharacters = (line: string) => {
  let openChunk = line.split('').reduce((acc, c) => {
    if (openChars.includes(c)) {
      return [...acc, c];
    } else if (isChunkCloseCharacter(c, tail(acc))) {
      return [...acc.slice(0, -1)];
    }
  }, []);

  const closeChunk = openChunk.reverse().map(getChunkCloseCharacter).join('');
  return closeChunk;
};

function part1(values: string[]): number {
  return values.map(firstSyntaxBreakingCharacter).map(getPointsPart1).reduce(sum);
}

function part2(values: string[]): number {
  const incompleteButValidLines = values.reduce((acc, line) => {
    let isIncompleteButValidLine = firstSyntaxBreakingCharacter(line) === undefined;
    return isIncompleteButValidLine ? [...acc, line] : acc;
  }, []);
  const scores = incompleteButValidLines.map(getLineFinishingCharacters).map(scoreString);
  return median(scores);
}

/* Tests */

assert.strictEqual(part1(demoInput), 26397);
assert.strictEqual(part1(input), 362271);

assert.strictEqual(part2(demoInput), 288957);
assert.strictEqual(part2(input), 1698395182);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
