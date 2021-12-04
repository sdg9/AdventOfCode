import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');
const inputNumbers = input[0].split(',').map(Number);
const inputBoards = input.slice(2).join('\n').split('\n\n');

type BingoTile = {
  num: number;
  scored: boolean;
};

export class Bingo {
  board: BingoTile[][];
  constructor(input: string) {
    this.board = input.split('\n').map((row) => {
      return row
        .trim()
        .split(/\s+/)
        .map(Number)
        .map((value) => ({ num: value, scored: false }));
    });
  }

  scoreTile(num: number) {
    this.board.forEach((row, rowIdx) =>
      row.forEach((tile, tileIdx) => {
        if (tile.num === num) {
          this.board[rowIdx][tileIdx].scored = true;
        }
      }),
    );
  }

  isWinner() {
    return this.board.some(
      (row, rowIdx) =>
        row.reduce((isWinner, currentTile) => isWinner && currentTile.scored, true) ||
        row.reduce((isWinner, _tile, colIdx) => isWinner && this.board[colIdx][rowIdx].scored, true),
    );
  }

  unmarkedSummation() {
    return this.board.reduce(
      (boardSum, row) => (boardSum += row.reduce((rowSum, tile) => (rowSum += tile.scored ? 0 : tile.num), 0)),
      0,
    );
  }
}

/* Functions */
function part1(numbers: number[], boards: string[]): number {
  let bingoBoards = boards.map((board) => new Bingo(board));
  let retVal = -1;
  numbers.some((value) => {
    return bingoBoards.some((board) => {
      board.scoreTile(value);
      if (board.isWinner()) {
        retVal = board.unmarkedSummation() * value;
        return true;
      }
      return false;
    });
  });
  return retVal;
}

function part2(numbers: number[], boards: string[]): number {
  let bingoBoards = boards.map((board) => new Bingo(board));
  let retVal = -1;
  numbers.forEach((value) => {
    bingoBoards.forEach((board, idx) => {
      if (!board.isWinner()) {
        board.scoreTile(value);
        if (board.isWinner()) {
          retVal = board.unmarkedSummation() * value;
        }
      }
    });
  });
  return retVal;
}

/* Tests */

assert.strictEqual(
  part1(
    [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1],
    [
      '22 13 17 11  0\n 8  2 23  4 24\n21  9 14 16  7\n 6 10  3 18  5\n 1 12 20 15 19',
      ' 3 15  0  2 22\n 9 18 13 17  5\n19  8  7 25 23\n20 11 10 24  4\n14 21 16 12  6',
      '14 21 17 24  4\n10 16 15  9 19\n18  8 23 26 20\n22 11 13  6  5\n 2  0 12  3  7',
    ],
  ),
  4512,
);
assert.strictEqual(part1(inputNumbers, inputBoards), 11774); // too high (not 41 with sum 707)

assert.strictEqual(
  part2(
    [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1],
    [
      '22 13 17 11  0\n 8  2 23  4 24\n21  9 14 16  7\n 6 10  3 18  5\n 1 12 20 15 19',
      ' 3 15  0  2 22\n 9 18 13 17  5\n19  8  7 25 23\n20 11 10 24  4\n14 21 16 12  6',
      '14 21 17 24  4\n10 16 15  9 19\n18  8 23 26 20\n22 11 13  6  5\n 2  0 12  3  7',
    ],
  ),
  1924,
);
assert.strictEqual(part2(inputNumbers, inputBoards), 4495); // too high (not 41 with sum 707)

/* Results */

console.time('Time');
const resultPart1 = part1(inputNumbers, inputBoards);
const resultPart2 = part2(inputNumbers, inputBoards); // 16560 too high
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
