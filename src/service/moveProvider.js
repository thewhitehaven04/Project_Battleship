import { choice, randInt } from '../utils/math';

/**
 * Implements an algorithm that chooses the next move.
 * @typedef {Object} MoveProvider
 * @property {function(Number, Array<import("./gameboard").BoardCoordinates>): import("./gameboard").BoardCoordinates} getCell
 * @returns {MoveProvider}
 */
const moveProvider = function () {
  /** @type {import("./gameboard").BoardCoordinates[]} */
  const previousAttempts = [];

  /**
   * @param {import('./gameboard').BoardCoordinates} cell
   * @param {Number} boardSize
   */
  const _getAdjacentForCell = (cell, boardSize) => {
    return [
      { x: cell.x + 1, y: cell.y },
      { x: cell.x, y: cell.y + 1 },
      { x: cell.x - 1, y: cell.y },
      { x: cell.x, y: cell.y - 1 },
    ].filter(({ x, y }) => x < boardSize && y < boardSize && x >= 0 && y >= 0);
  };

  /**
   * @param {import("./gameboard").BoardCoordinates[]} missedHits
   * @param {Number} boardSize
   */
  const _getAdjacentToPreviousHits = (missedHits, boardSize) => {
    return previousAttempts
      .map((hit) => _getAdjacentForCell(hit, boardSize))
      .flat(1)
      .filter(
        (adjacent) =>
          !missedHits.find(({ x, y }) => x === adjacent.x && y === adjacent.y),
      )
      .filter(
        (adjacent) =>
          !previousAttempts.find(
            ({ x, y }) => x === adjacent.x && y === adjacent.y,
          ),
      );
  };

  const getCell = (boardSize, missedHits) => {
    const adjacent = _getAdjacentToPreviousHits(missedHits, boardSize);
    if (adjacent.length >= 1) {
      const generated = choice(adjacent);
      previousAttempts.push(generated);
      return generated;
    }

    let generated = {
      x: randInt(0, boardSize),
      y: randInt(0, boardSize),
    };
    while (
      previousAttempts.find(
        (cell) => cell.x === generated.x && cell.y === generated.y,
      ) ||
      missedHits.find(
        (cell) => cell.x === generated.x && cell.y === generated.y,
      )
    ) {
      generated = {
        x: randInt(0, boardSize),
        y: randInt(0, boardSize),
      };
    }
    previousAttempts.push(generated);
    return generated;
  };

  return { getCell };
};

export { moveProvider };
