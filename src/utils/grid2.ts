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

  flat() {
    // return this.values.flat();
    return this.values
      .map((rowValue, y) => {
        return rowValue.map((colValue, x) => {
          return {
            position: new Vector2(x, y),
            value: colValue,
          };
        });
      })
      .flat();
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

  maxX(): number {
    return this.values[0].length;
  }

  maxY(): number {
    return this.values.length;
  }

  size() {
    return this.maxX() * this.maxY();
  }

  getVector(position: Vector2): T {
    return this.values?.[position.y]?.[position.x];
  }

  setVector(position: Vector2, value: T) {
    this.values[position.y][position.x] = value;
  }

  getNeighborPositions(position: Vector2, includeAdjacent = false): Vector2[] {
    const north = new Vector2(0, -1);
    const east = new Vector2(1, 0);
    const south = new Vector2(0, 1);
    const west = new Vector2(-1, 0);

    const northEast = new Vector2(1, -1);
    const northWest = new Vector2(-1, -1);
    const southEast = new Vector2(1, 1);
    const southWest = new Vector2(-1, 1);
    const diagonals = [
      position.add(northEast),
      position.add(northWest),
      position.add(southEast),
      position.add(southWest),
    ];
    const cardinal = [position.add(north), position.add(east), position.add(south), position.add(west)];

    return includeAdjacent ? [...cardinal, ...diagonals] : cardinal;
  }

  getNeighborValues(position: Vector2) {
    return this.getNeighborPositions(position)
      .map((i) => this.getVector(i))
      .filter((i) => i !== undefined);
  }
}
