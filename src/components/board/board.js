/**
 * @typedef {Object} BoardState
 * @property {import("../../service/gameboard").BoardCellDto[][]} cells
 */

import { BoardCell } from '../boardCell/boardCell';
import style from './board.css';

/**
 * @typedef BoardViewMapping
 * @property {import('../../service/gameboard').BoardCellDto} data
 * @property {UpdatableView<import('../../service/gameboard').BoardCellDto>} element
 */
/** @type {Component<BoardState>} */

/** @implements {Component<BoardState>} */
class Board {
  #root;

  /** @param {BoardState} boardState */
  constructor(boardState) {
    this.length = boardState.cells.length

    /** @type {BoardViewMapping[][]} */
    this.cellsMap = Array(boardState.cells.length).fill(Array(undefined));
    this.cellsMap = boardState.cells.map((cellArray) => {
      return cellArray.map((cell) => {
        return {
          data: cell,
          element: new BoardCell(cell),
        };
      });
    });
    this.#root = document.createElement('div');
  }

  /** @param {BoardState} boardState */
  update(boardState) {
    for (let i = 0; i < this.cellsMap.length; i++) {
      for (let j = 0; j < this.cellsMap[i].length; j++) {
        if (boardState.cells[i][j] !== this.cellsMap[i][j].data) {
          this.cellsMap[i][j].data = boardState.cells[i][j];
          this.cellsMap[i][j].element.update(boardState.cells[i][j]);
        }
      }
    }
  }

  render() {
    this.#root.replaceChildren();
    this.#root.classList.add('board__grid');
    for (let i = 0; i < this.cellsMap.length; i++)
      for (let j = 0; j < this.cellsMap[i].length; j++)
        this.#root.appendChild(this.cellsMap[j][i].element.render());

    return this.#root;
  }

  /** @param {import('../../service/gameboard').BoardCoordinates} coordinates */
  getBoardCellByCoordinates(coordinates) {
    return this.cellsMap[coordinates.y][coordinates.x];
  }

  /**
   * @param {Node} boardCell 
   * @returns {import('../../service/gameboard').BoardCoordinates}
   */
  getCoordinatesByBoardCell(boardCell) {
    const length = this.cellsMap.length;
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        if (this.cellsMap[i][j].element.render() === boardCell) {
          return { x: i, y: j };
        }
      }
    }
    return { x: -1, y: -1 };
  }
}

export { Board };