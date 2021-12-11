import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { Grid } from '../../utils/grid2';

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
  // console.log('Before: ', grid);

  // increment
  // let energyGained = new Grid(grid.map((pos, val) => val + 1));
  for (let i = 0; i < steps; i++) {
    let updatedGrid = tick(grid);
    totalFlashes += updatedGrid.timesFlashed;
    // console.log('Updated: ', updatedGrid.grid);
    // console.log('Times: ', updatedGrid.timesFlashed);
    grid = updatedGrid.grid;
  }

  // Flash
  // const flashPositions = []; energyGained.forEach((pos, val) => { if (val > 9) {
  //     // flashPositions.add(`${pos.x}, ${pos.y}`);
  //     flashPositions.push(pos);
  //   }
  // });

  // // use -1 as value to indicate pending flash
  // flashPositions.forEach((pos) => {
  //   const neighbors = energyGained.getNeighborPositions(pos, true);
  //   // increment neighbor
  //   neighbors.forEach((neighborPos) => {
  //     let neighborValue = energyGained.getVector(neighborPos);
  //     if (neighborValue >= 0) {
  //       energyGained.setVector(neighborPos, neighborValue + 1);
  //     }
  //   });

  //   // resolve self
  //   energyGained.setVector(pos, -1);
  // });

  // repeat as long as there are flash positions

  // when no more flash positions, set all positions of -1 to 0

  // console.log('Flashed', flashPositions);
  // console.log('After', energyGained);
  // }
  return totalFlashes;
}

function part2(values: number[]): number {
  return 0;
}

assert.strictEqual(part1(demoInput), 1656);
assert.strictEqual(part2([1, -1]), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
// const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
