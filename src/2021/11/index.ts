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

const incrementEnergyAllPositions = (grid: Grid<number>) => {
  return new Grid(grid.map((pos, val) => val + 1));
};

const resetFlashedPositions = (grid: Grid<number>) => {
  return new Grid(grid.map((pos, val) => (val < 0 ? 0 : val)));
};

const flash = (grid: Grid<any>, timesFlashed = 0) => {
  const flashPositions = [];

  grid.forEach((pos, val) => {
    if (val > 9) {
      flashPositions.push(pos);
      timesFlashed += 1;
      // console.log('flash');
    }
  });
  // console.log('FP: ', flashPositions);

  if (flashPositions.length === 0) {
    // return grid;
    return { flashedGrid: grid, timesFlashed };
  }

  // resolve flash
  flashPositions.forEach((pos) => {
    const neighbors = grid.getNeighborPositions(pos, true);

    // increment neighbor
    neighbors.forEach((neighborPos) => {
      const neighborValue = grid.getVector(neighborPos);
      if (neighborValue >= 0) {
        grid.setVector(neighborPos, neighborValue + 1);
      }
    });

    // reduce processed flash
    grid.setVector(pos, -1);
  });

  // return flash(grid, timesFlashed);
  // repeat
  return flash(grid, timesFlashed);
};

const tick = (grid: Grid<number>) => {
  let incremented = incrementEnergyAllPositions(grid);
  let { flashedGrid, timesFlashed } = flash(incremented);
  let flashCooldown = resetFlashedPositions(flashedGrid);
  return { grid: flashCooldown, timesFlashed };
};

function part1(values: string[], steps = 100): number {
  let grid = parse(values);

  let totalFlashes = 0;
  for (let i = 0; i < steps; i++) {
    let updatedGrid = tick(grid);
    totalFlashes += updatedGrid.timesFlashed;
    grid = updatedGrid.grid;
  }
  return totalFlashes;
}

function part2(values: string[]): number {
  let grid = parse(values);

  let step = 0;
  let totalFlashes = 0;

  while (totalFlashes !== grid.size()) {
    step += 1;
    let updatedGrid = tick(grid);
    totalFlashes = updatedGrid.timesFlashed;
    grid = updatedGrid.grid;
  }
  return step;
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
