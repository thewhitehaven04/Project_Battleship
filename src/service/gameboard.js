import { PubSub } from '../utils/eventBus';
import { Ship } from './ship';

/**
 * @typedef {Object} GameboardDto
 * @property {Array<Array<BoardCellDto>>} board
 */

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

/**
 * @typedef {Object} BoardCellDto
 * @property {?import('./ship').ShipDto} ship
 * @property {Boolean} isHit
 */

/** @typedef {GameboardDto} AllShipsDestroyedEvent */

const ALL_SHIPS_DESTROYED_EVENT = 'AllShipsDestroyed';

class Gameboard {
  /** @type {PubSub} */
  #pubSub;
  /** @type {Ship[]} */
  #ships;

  /**
   * @param {number} size
   * @param {PubSub} pubSub
   */
  constructor(size, pubSub) {
    this.#pubSub = pubSub;
    this.#ships = [];
    this.size = size;

    /** @type BoardCell[][] */
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
   * @param {BoardCoordinates} start
   * @param {BoardCoordinates} end
   */
  #hasIntersectionWithOtherShips(start, end) {
    for (let i = start.x; i <= end.x; i++)
      if (this.board[i][start.y].ship) return true;

    for (let j = start.y; j <= end.y; j++)
      if (this.board[start.x][j].ship) return true;

    return false;
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
    const errorMsg =
      'This ship cannot be placed in this way as it instersects with previously placed ships';
    if (x >= 0 && y >= 0) {
      if (!vertical && x + ship.length - 1 < this.board.length) {
        if (
          this.#hasIntersectionWithOtherShips(
            { x, y },
            { x: x + ship.length - 1, y },
          )
        )
          throw new RangeError(errorMsg);

        for (let j = x; j < x + ship.length; j++) this.board[j][y].ship = ship;
        this.#ships.push(ship);
        return ship;
      } else if (vertical && y + ship.length - 1 < this.board.length) {
        if (
          this.#hasIntersectionWithOtherShips(
            { x, y },
            { x, y: y + ship.length - 1 },
          )
        )
          throw new RangeError(errorMsg);
        for (let k = y; k < y + ship.length; k++) this.board[x][k].ship = ship;
        this.#ships.push(ship);
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

    if (this.#ships.every((ship) => ship.isSunk()))
      this.#pubSub.notify(ALL_SHIPS_DESTROYED_EVENT, this.toJSON());
  }

  /** @returns {Array<BoardCoordinates>} */
  getMissedHits() {
    /** @type {Array<BoardCoordinates>} */
    const missedHits = [];
    this.board.forEach((cellArr, i) =>
      cellArr.forEach((cell, j) => {
        if (cell.isHit === true && cell.ship === null) {
          missedHits.push({ x: i, y: j });
        }
      }),
    );
    return missedHits;
  }

  /** @returns {GameboardDto} */
  toJSON = () => {
    return {
      board: this.board.map((cellArr) => {
        return cellArr.map((cell) => {
          return {
            ship: cell.ship?.toJSON() ?? null,
            isHit: cell.isHit,
          };
        });
      })
    }
};
}

export { Gameboard, ALL_SHIPS_DESTROYED_EVENT };
