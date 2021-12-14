import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { countItems } from '../../utils/array';

const rawInput = readInput();
// const input = rawInput.split('\n').map(Number);
const demoInput = readDemoInput();

const parse = (values) => {
  let [template, pairInsertionRules] = values.split('\n\n');
  //   console.log(template);

  const insertionRules = pairInsertionRules
    .split('\n')
    .map((i) => i.split(' -> '))
    .reduce((map, i) => {
      map[i[0]] = i[1];
      return map;
    }, {});

  return {
    template,
    insertionRules,
  };
};

/* Functions */

function getPolymer(values: string, steps = 5) {
  const { template, insertionRules } = parse(values);
  //   console.log('PIR: ', pairInsertionRules);

  let currentTemplate: string = template;
  for (let i = 0; i < steps; i++) {
    let nextTemplate = '';
    currentTemplate.split('').forEach((c, idx, array) => {
      //   console.log('i: ', c);
      if (idx > 0) {
        const translation = insertionRules[`${array[idx - 1]}${c}`];
        nextTemplate += translation;
      }
      nextTemplate += c;
    });
    currentTemplate = nextTemplate;
    // console.log(`NT-${i}: `, nextTemplate);
  }
  return currentTemplate;
}

function part1(values: string, steps = 5): number {
  const currentTemplate = getPolymer(values, steps);

  const items = countItems(currentTemplate.split(''));
  const maxKey = Object.keys(items).reduce((a, b) => (items[a] > items[b] ? a : b));
  const minKey = Object.keys(items).reduce((a, b) => (items[a] < items[b] ? a : b));

  //   console.log('Items: ', items);
  //   console.log('Max: ', items[maxKey]);
  //   console.log('Min: ', items[minKey]);

  return items[maxKey] - items[minKey];
}

function part2(values: number[]): number {
  return 0;
}

/* Tests */

assert.strictEqual(getPolymer(demoInput, 0), 'NNCB');
assert.strictEqual(getPolymer(demoInput, 1), 'NCNBCHB');
assert.strictEqual(getPolymer(demoInput, 2), 'NBCCNBBBCBHCB');
assert.strictEqual(getPolymer(demoInput, 3), 'NBBBCNCCNBBNBNBBCHBHHBCHB');
assert.strictEqual(getPolymer(demoInput, 4), 'NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB');
assert.strictEqual(part1(demoInput, 10), 1588);

assert.strictEqual(getPolymer(rawInput, 0), 'KHSNHFKVVSVPSCVHBHNP');
assert.strictEqual(getPolymer(rawInput, 1), 'KNHCSNNVHSFPKPVSVBSOVHPCSCCSVNHHBBHPNFP');
assert.strictEqual(part1(rawInput, 10), 2408);

/* Results */

console.time('Time');
const resultPart1 = part1(rawInput, 10);
const resultPart2 = part1(rawInput, 40); // will need to optimize...
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
