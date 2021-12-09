/**
 * Day 9 2021
 * https://adventofcode.com/2021/day/9
 */

import { Vector2 } from './grid';

export class Grid<T> {
  values: T[][];

  constructor(values: T[][]) {
    this.values = values;
  }

  forEach(cb: (position: Vector2, value: T) => void) {
    this.values.forEach((rowValue, y) => {
      rowValue.forEach((colValue, x) => {
        cb(new Vector2(x, y), colValue);
      });
    });
  }

  map(cb: (position: Vector2, value: T) => T): T[][] {
    return this.values.map((rowValue, y) => {
      return rowValue.map((colValue, x) => {
        return cb(new Vector2(x, y), colValue);
      });
    });
  }

  reduce(cb: (position: Vector2, value: T) => number): number {
    return this.values.reduce((acc, rowValue, y) => {
      return (
        acc +
        rowValue.reduce((acc2, colValue, x) => {
          return acc2 + cb(new Vector2(x, y), colValue);
        }, 0)
      );
    }, 0);
  }

  getVector(position: Vector2): T {
    return this.values?.[position.y]?.[position.x];
  }

  getNeighborPositions(position: Vector2): Vector2[] {
    const north = new Vector2(0, -1);
    const east = new Vector2(1, 0);
    const south = new Vector2(0, 1);
    const west = new Vector2(-1, 0);
    return [position.add(north), position.add(east), position.add(south), position.add(west)];
  }

  getNeighborValues(position: Vector2) {
    return this.getNeighborPositions(position)
      .map((i) => this.getVector(i))
      .filter((i) => i !== undefined);
  }
}
