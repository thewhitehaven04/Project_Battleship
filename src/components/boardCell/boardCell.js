import {
  library,
  dom,
  findIconDefinition,
  icon,
} from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import style from './boardCell.css';

library.add(fas, far);
dom.i2svg();

/**
 * @implements {Component<import('../../service/gameboard').BoardCellDto>}
 */
class BoardCell {
  xMark = icon(findIconDefinition({ iconName: 'xmark', prefix: 'fas' }));
  ship = icon(findIconDefinition({ iconName: 'ship', prefix: 'fas' }));
  water = icon(findIconDefinition({ iconName: 'water', prefix: 'fas' }));
  locationCrosshairs = icon(
    findIconDefinition({ iconName: 'location-crosshairs', prefix: 'fas' }),
  );
  #boardCellData;

  /** @param {import('../../service/gameboard').BoardCellDto} boardCell */
  constructor(boardCell) {
    this.root = document.createElement('div');
    this.root.classList.add('board-cell');

    this.#boardCellData = boardCell;
    this.root.appendChild(this.#getIcon(this.#boardCellData));
  }

  /** @param {import('../../service/gameboard').BoardCellDto} boardCell */
  #getIcon(boardCell) {
    if (boardCell?.ship)
      return boardCell?.isHit ? this.xMark.node[0] : this.ship.node[0];
    return boardCell?.isHit
      ? this.locationCrosshairs.node[0]
      : this.water.node[0];
  }

  render() {
    return this.root;
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

export { BoardCell };
