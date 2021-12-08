import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { difference, intersection, union } from '../../utils/set';
import { permutations } from '../../utils/permuations';
import { arrayToSingleNumber } from '../../utils/array';

const rawInput = readInput();

const sorted = (input: string) => input.split('').sort().join('');
/**
 * Parse input | output and make sure each signal is sorted (for comparison later)
 */
const parse = (input) =>
  input.split('\n').map((v) =>
    v
      .split('|')
      .map((v) => v.trim())
      .map((v) => v.split(' ').map(sorted)),
  );
const input = parse(rawInput);
const demoInput = parse(readDemoInput());

/* Functions */
function part1(values: string[][][]): number {
  const desiredLengths = [2, 4, 3, 7];
  return values.reduce(
    (totalSum, [signalPatterns, outputs]) =>
      totalSum + outputs.reduce((sum, i) => sum + (desiredLengths.includes(i.length) ? 1 : 0), 0),
    0,
  );
}

const isLengthX = (x: number) => (i: string) => i.length === x;

/**
 * 2 intersected with 5 is 8, 3 does not do this with 2 or 5 thus when I find the intersection of 8 (size 7) I know the other signal is a 3
 */
const identifyThree = (signals: string[]) => {
  const unordered235 = signals.filter(isLengthX(5));
  return permutations(unordered235).reduce((acc: string, [a, b, c]) => (union(a, b).length === 7 ? c : acc), '');
};

const identifyTwoAndFive = (signals: string[], three: string, e: string) => {
  const length5Signals = signals.filter(isLengthX(5));
  const two = length5Signals.find((item) => item.includes(e));
  const five = length5Signals.find((item) => item !== two && item !== three);
  return [two, five];
};

/**
 * Letter to signal mapping referenced in code 
 *    0:      1:      2:      3:      4:
 *   aaaa    ....    aaaa    aaaa    ....
 *  b    c  .    c  .    c  .    c  b    c
 *  b    c  .    c  .    c  .    c  b    c
 *   ....    ....    dddd    dddd    dddd
 *  e    f  .    f  e    .  .    f  .    f
 *  e    f  .    f  e    .  .    f  .    f
 *   gggg    ....    gggg    gggg    ....

 *    5:      6:      7:      8:      9:
 *   aaaa    aaaa    aaaa    aaaa    aaaa
 *  b    .  b    .  .    c  b    c  b    c
 *  b    .  b    .  .    c  b    c  b    c
 *   dddd    dddd    ....    dddd    dddd
 *  .    f  e    f  .    f  e    f  .    f
 *  .    f  e    f  .    f  e    f  .    f
 *   gggg    gggg    ....    gggg    gggg
 * @param signals 
 * @returns 
 */
const getNumberMapping = (signals: string[]) => {
  const one = signals.find(isLengthX(2));
  const three = identifyThree(signals);
  const four = signals.find(isLengthX(4));
  const seven = signals.find(isLengthX(3));
  const eight = signals.find(isLengthX(7));
  const nine = sorted(union(three, four));
  //   const a = difference(seven, one); // unused
  const e = difference(eight, nine);
  const [two, five] = identifyTwoAndFive(signals, three, e);
  const bOrD = difference(four, one);
  const d = intersection(bOrD, two);
  //   const b = difference(bOrD, d); // unused
  const zero = sorted(difference(eight, d));
  const six = signals.filter(isLengthX(6)).find((item) => item !== nine && item !== zero);

  return (key: string) => {
    const map = {
      [sorted(one)]: 1,
      [sorted(two)]: 2,
      [sorted(three)]: 3,
      [sorted(four)]: 4,
      [sorted(five)]: 5,
      [sorted(six)]: 6,
      [sorted(seven)]: 7,
      [sorted(eight)]: 8,
      [sorted(nine)]: 9,
      [sorted(zero)]: 0,
    };
    return map[key];
  };
};

function part2(values: string[][][]): number {
  return values.reduce((sum, [input, output]) => {
    const numberMap = getNumberMapping(input);
    return sum + arrayToSingleNumber(output.map(numberMap));
  }, 0);
}

/* Tests */

assert.strictEqual(part1(demoInput), 26);
assert.strictEqual(part1(input), 548);

assert.strictEqual(
  part2(parse('acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf')),
  5353,
);
assert.strictEqual(
  part2(parse('acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf')),
  5353,
);
assert.strictEqual(
  part2(parse('edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc')),
  9781,
);
assert.strictEqual(part2(parse('fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg')), 1197);
assert.strictEqual(
  part2(parse('fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb')),
  9361,
);
assert.strictEqual(
  part2(parse('aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea')),
  4873,
);
assert.strictEqual(
  part2(parse('fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb')),
  8418,
);
assert.strictEqual(
  part2(parse('dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe')),
  4548,
);
assert.strictEqual(
  part2(parse('bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef')),
  1625,
);
assert.strictEqual(part2(demoInput), 61229);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);

console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
