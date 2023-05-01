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
 * @implements {UpdatableView<import('../../service/gameboard').BoardCellDto>}
 */
class BoardCellView {
  xMark = icon(findIconDefinition({ iconName: 'xmark', prefix: 'fas' }));
  ship = icon(findIconDefinition({ iconName: 'ship', prefix: 'fas' }));
  water = icon(findIconDefinition({ iconName: 'water', prefix: 'fas' }));
  locationCrosshairs = icon(
    findIconDefinition({ iconName: 'location-crosshairs', prefix: 'fas' }),
  );
  #root;
  #boardCellData;

  /** @param {import('../../service/gameboard').BoardCellDto} boardCell */
  constructor(boardCell) {
    this.#root = document.createElement('div');
    this.#root.classList.add('board-cell');
    this.#root.appendChild(this.#getIcon(this.#boardCellData));
    
    this.#boardCellData = boardCell;
  }

  /** @param {import('../../service/gameboard').BoardCellDto} boardCell */
  #getIcon(boardCell) {
    if (boardCell?.ship) {
      if (boardCell?.isHit) return this.xMark.node[0];
      else return this.ship.node[0];
    } else {
      if (boardCell?.isHit) return this.locationCrosshairs.node[0];
      else return this.water.node[0];
    }
  }

  render() {
    return this.#root;
  }

  /** @param {import("../../service/gameboard").BoardCellDto} boardCell */
  update(boardCell) {
    this.#root.replaceChildren(this.#getIcon(boardCell));
  }
}

export { BoardCellView };
