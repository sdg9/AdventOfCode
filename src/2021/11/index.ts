import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { Grid } from '../../utils/grid2';
import { setPriority } from 'os';

const rawInput = readInput();
const input = rawInput.split('\n');
const demoInput = readDemoInput().split('\n');

/* Functions */
function parse(values: string[]) {
  const parsed = values.map((row) => row.split('').map(Number));
  return new Grid(parsed);
}

const inRefactoryPeriod = -1;
const isNotInRefactoryPeriod = (val: number) => val >= 0;

const incrementAllPositions = (grid: Grid<number>) => {
  return new Grid(grid.map((pos, val) => val + 1));
};

const recoverFlashedRefactoryPeriod = ({ grid, flashCount }: { grid: Grid<number>; flashCount: number }) => {
  return { grid: new Grid(grid.map((pos, val) => (isNotInRefactoryPeriod(val) ? val : 0))), flashCount };
};

/**
 * Any octopus with an energy level greater than 9 flashes increases the energy level of all adjacent octopuses by 1
 * @param grid
 * @param flashCount
 * @returns
 */
const flash = (grid: Grid<number>, flashCount = 0) => {
  const flashPositions = grid
    .flat()
    .filter(({ position, value }) => value > 9)
    .map(({ position }) => position);

  if (flashPositions.length === 0) {
    return { grid, flashCount };
  }

  flashPositions.forEach((currentPosition) => {
    grid.getNeighborPositions(currentPosition, true).forEach((neighbor) => {
      const neighborValue = grid.getVector(neighbor);
      if (isNotInRefactoryPeriod(neighborValue)) {
        grid.setVector(neighbor, neighborValue + 1);
      }
    });

    grid.setVector(currentPosition, inRefactoryPeriod);
  });

  return flash(grid, flashCount + flashPositions.length);
};

const tick = (grid: Grid<number>) => recoverFlashedRefactoryPeriod(flash(incrementAllPositions(grid)));

const takeSteps = (g: Grid<number>, steps: number, count: number = 0) => {
  if (steps === 0) {
    return count;
  } else {
    let { grid, flashCount } = tick(g);
    return takeSteps(grid, steps - 1, count + flashCount);
  }
};

function part1(values: string[], steps = 100): number {
  return takeSteps(parse(values), 100);
}

const getStepsRequiredForSynchronizedGridFlash = (g: Grid<number>, currentStep = 0) => {
  let { flashCount, grid } = tick(g);
  if (flashCount === g.size()) {
    return currentStep + 1;
  } else {
    return getStepsRequiredForSynchronizedGridFlash(grid, currentStep + 1);
  }
};

function part2(values: string[]): number {
  return getStepsRequiredForSynchronizedGridFlash(parse(values));
}

assert.strictEqual(part1(demoInput), 1656);
assert.strictEqual(part1(input), 1667);
assert.strictEqual(part2(demoInput), 195);
assert.strictEqual(part2(input), 488);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
