import { BoardCell } from '../boardCell/boardCell';

class EnemyBoardCell extends BoardCell {
  /** @param {import("../../service/gameboard").BoardCellDto} boardCell */
  #getIcon(boardCell) {
    const { ship, isHit } = boardCell;
    if (!ship)
      return !isHit ? this.water.node[0] : this.locationCrosshairs.node[0];
    return !isHit ? this.water.node[0] : this.xMark.node[0];
  }

  /** @param {import("../../service/gameboard").BoardCellDto} boardCell */
  update(boardCell) {
    const { isHit, ship } = boardCell;
    if (isHit)
      ship
        ? this.root.classList.add('board-cell-hit')
        : this.root.classList.add('board-cell-miss');
    this.root.replaceChildren(this.#getIcon(boardCell));
  }
}

export { EnemyBoardCell };
