import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split(',').map(Number);

/* Functions */

const inputToMap = (values: number[]): Map<number, number> => {
  let lanternFishMap = new Map<number, number>();
  values.forEach((value) => {
    lanternFishMap.set(value, (lanternFishMap.get(value) ?? 0) + 1);
  });
  return lanternFishMap;
};

const simulateLanternfishTick = (
  values: Map<number, number>,
  birthFrequency = 7,
  spawnedAge = 8,
): Map<number, number> => {
  let nextMap = new Map<number, number>();
  for (let [age, quantity] of values) {
    let nextAge = age - 1;
    const givesBirth = nextAge < 0;
    if (givesBirth) {
      nextAge = birthFrequency - 1;
      nextMap.set(spawnedAge, (nextMap.get(spawnedAge) ?? 0) + quantity);
    }
    nextMap.set(nextAge, (nextMap.get(nextAge) ?? 0) + quantity);
  }
  return nextMap;
};

function part1and2(values: number[], days: number): number {
  let lanternFishMap = inputToMap(values);

  for (let i = 0; i < days; i++) {
    lanternFishMap = simulateLanternfishTick(lanternFishMap);
  }

  let totalFish = 0;
  for (const [key, value] of lanternFishMap) {
    totalFish += value;
  }
  return totalFish;
}

/* Tests */

assert.strictEqual(part1and2([3, 4, 3, 1, 2], 80), 5934);
assert.strictEqual(part1and2(input, 80), 345387);

assert.strictEqual(part1and2([3, 4, 3, 1, 2], 256), 26984457539);
assert.strictEqual(part1and2(input, 256), 1574445493136);

/* Results */

console.time('Time');
const resultPart1 = part1and2(input, 80);
const resultPart2 = part1and2(input, 256);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
