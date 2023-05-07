/**
 * Implements an algorithm that chooses the next move.
 * @typedef {Object} MoveProvider
 * @property {function(Number, Array<import("./gameboard").BoardCoordinates>): import("./gameboard").BoardCoordinates} getCell
 */

import { randInt } from "../utils/math";

/**
 * @returns {MoveProvider}
 */
const moveProvider = function () {
  const previousHits = [];

  return {
    getCell: function (boardSize, missedHits) {
      let generated = {
        x: randInt(0, boardSize),
        y: randInt(0, boardSize),
      };
      while (
        previousHits.find(
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
      previousHits.push(generated);
      return generated;
    },
  };
};

export { moveProvider };
