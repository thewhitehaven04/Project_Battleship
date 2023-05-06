/** @typedef {import('../../service/gameboard').GameboardDto} BoardState */

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

  /** @param {BoardState} boardState */
  constructor(boardState) {
    this.length = boardState.board.length

    /** @type {BoardViewMapping[][]} */
    this.cellsMap = Array(boardState.board.length).fill(Array(undefined));
    this.cellsMap = boardState.board.map((cellArray) => {
      return cellArray.map((cell) => {
        return {
          data: cell,
          element: new BoardCell(cell),
        };
      });
    });
    this.root = document.createElement('div');
  }

  /** @param {BoardState} boardState */
  update(boardState) {
    for (let i = 0; i < this.cellsMap.length; i++) {
      for (let j = 0; j < this.cellsMap[i].length; j++) {
        if (boardState.board[i][j] !== this.cellsMap[i][j].data) {
          this.cellsMap[i][j].data = boardState.board[i][j];
          this.cellsMap[i][j].element.update(boardState.board[i][j]);
        }
      }
    }
  }

  render() {
    this.root.replaceChildren();
    this.root.classList.add('board__grid');
    for (let i = 0; i < this.cellsMap.length; i++)
      for (let j = 0; j < this.cellsMap[i].length; j++)
        this.root.appendChild(this.cellsMap[j][i].element.render());

    return this.root;
  }

  /** @param {import('../../service/gameboard').BoardCoordinates} coordinates */
  getBoardCellByCoordinates(coordinates) {
    return this.cellsMap[coordinates.x][coordinates.y];
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