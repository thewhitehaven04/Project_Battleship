import { BoardController } from '../controller/boardController';
import { Gameboard } from '../service/gameboard';
import { ShipType } from '../service/ship';
import { boardCellFactory } from './boardCell';

const shipTypeMapping = new Map();
shipTypeMapping
  .set(ShipType.BATTLESHIP, 'battleship')
  .set(ShipType.CARRIER, 'aircraft carrier')
  .set(ShipType.CRUISER, 'cruiser')
  .set(ShipType.DESTROYER, 'destroyer')
  .set(ShipType.SUB, 'submarine');

/**
 * @typedef {Object} ShipPlacementRequest
 * @property {?import('./../service/ship.js').ShipDto} ship
 * @property {Array<Array<import('../service/gameboard').BoardCellDto>>} boardState
 */

/**
 * @typedef {Object} ShipPlacementCommand
 * @property {import('./../service/ship.js').ShipDto} ship
 * @property {import('../service/gameboard').BoardCoordinates} coordinates
 */

/**
 * @typedef BoardViewMapping
 * @property {import('../service/gameboard').BoardCellDto} data
 * @property {UpdatableView<import('../service/gameboard').BoardCellDto>} element
 */

/**
 * @implements {UpdatableView<ShipPlacementRequest>}
 */
class PlaceShipsBoardView {
  #state;
  #root;
  #spanShipBeingSelected;
  #cellsMap;
  #currentListener;

  /**
   * @param {ShipPlacementRequest} viewState
   */
  constructor(viewState) {
    this.#state = viewState;

    this.#root = document.createElement('div');
    this.#spanShipBeingSelected = document.createElement('span');

    /** @type {BoardViewMapping[][]} */
    this.#cellsMap = Array(this.#state.boardState?.length).fill(undefined);
    /** fill the cells and store them in a two-dimensional array so that both their
     * data and dom elements can be found by their indices and vice-versa */
    for (let i = 0; i < this.#state.boardState.length; i++) {
      for (let j = 0; j < this.#state.boardState[i].length; j++) {
        this.#cellsMap[i][j] = {
          data: this.#state.boardState[i][j],
          element: boardCellFactory(this.#state.boardState[i][j]),
        };
      }
    }
    this.#currentListener = null;
  }

  /**
   * @param {function(ShipPlacementCommand): void} handler
   * @param {ShipPlacementCommand} command 
   */
  handlePlacement = (handler, command) => {
    handler(command);
  };

  /**
   * @param {Node} boardCell
   * @return {import('../service/gameboard').BoardCoordinates}
   */
  #getCoordinatesByCell(boardCell) {
    for (let i = 0; i < this.#cellsMap.length; i++) {
      for (let j = 0; j < this.#cellsMap[i].length; j++) {
        if (this.#cellsMap[i][j].element.render() === boardCell)
          return { x: i, y: j };
      }
    }
    return { x: -1, y: -1 };
  }

  /** @param {import('../service/ship').ShipDto} ship */
  #requestShipCoordinates(ship) {
    this.#currentListener = (event) => {
      if (event.target.matches('boardCell')) {
        this.handlePlacement({
          ship: ship,
          coordinates: this.#getCoordinatesByCell(node),
        }) 
      }
    };
    this.#spanShipBeingSelected.textContent = `Place the ${shipTypeMapping.get(
      ship.type,
    )}`;
  }

  render() {
    return this.#root;
  }

  /** @param {ShipPlacementRequest} shipPlacementRequest */
  update({ ship, boardState }) {
    if (boardState)
      for (let i = 0; i < boardState.length ?? 0; i++) {
        for (let j = 0; j < boardState[i].length; j++) {
          this.#cellsMap[i][j] = boardState[i][j];
        }
      }

    if (ship) this.#requestShipCoordinates(ship);
  }
}

export { PlaceShipsBoardView };
