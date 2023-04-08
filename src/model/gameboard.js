import { Ship } from './ship';

/**
 * @typedef {Object} BoardCoordinates
 * @property {Number} x
 * @property {Number} y
 */

/**
 * @typedef {Object} BoardCell
 * @property {?Ship} ship
 * @property {Boolean} isHit
 */

class Gameboard {
  /**
   * @param {Number} size
   */
  constructor(size) {
    /**
     * @type Array<Array<BoardCell>>
     */
    this.board = Array(size);
    for (let i = 0; i < size; i++) {
      this.board[i] = Array(size);
      for (let j = 0; j < size; j++) {
        this.board[i][j] = {
          ship: null,
          isHit: false,
        };
      }
    }
  }

  /**
   * 
   * @param {BoardCoordinates} start 
   * @param {BoardCoordinates} end 
   */
  #doesNotIntersect(start, end) {
    return  
  }

  /**
   * Places a ship on the gameboard. By default, the `startCoordinates` parameter
   * corresponds to the leftmost cell of the board. If the `vertical` parameter is set to true,
   * then the `startCoordinates` is considered to correspond to the upmost cell of the board.
   * @param {BoardCoordinates} startCoordinates
   * @param {function(): Ship} shipFactory
   * @param {Boolean} vertical
   */
  placeShip({ x, y }, shipFactory, vertical = false) {
    const ship = shipFactory();
    if (x > 0 && y > 0) {
      if (!vertical && x + ship.length - 1 < this.board.length) {
        for (let j = x; j < x + ship.length - 1; j++) this.board[j][y].ship = ship;
        return ship;
      } else if (vertical && y + ship.length - 1 < this.board.length) {
        for (let k = y; k < y + ship.length - 1; k++) this.board[x][k].ship = ship;
        return ship;
      }
    }
    throw new RangeError('This ship is outside board boundaries');
  }

  /**
   * @param {BoardCoordinates} attackCoordinates
   */
  receiveAttack({ x, y }) {
    let boardCell = this.board[x][y];
    boardCell.ship?.hit();
    boardCell.isHit = true;
  }
}

export { Gameboard };
