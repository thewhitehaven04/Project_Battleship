import { Board } from '../../components/board/board';
import { ShipType } from '../../service/ship';
import style from './placeShips.css';

const shipTypeMapping = new Map();
shipTypeMapping
  .set(ShipType.BATTLESHIP.type, 'battleship')
  .set(ShipType.CARRIER.type, 'aircraft carrier')
  .set(ShipType.CRUISER.type, 'cruiser')
  .set(ShipType.DESTROYER.type, 'destroyer')
  .set(ShipType.SUB.type, 'submarine');

/**
 * @typedef {Object} ShipPlacementRequest
 * @property {?import('../../service/ship.js').ShipDto} ship
 * @property {Array<Array<import('../../service/gameboard').BoardCellDto>>} boardState
 */

/**
 * @typedef {Object} ShipPlacementCommand
 * @property {import('../../service/ship.js').ShipDto} ship
 * @property {import('../../service/gameboard').BoardCoordinates} coordinates
 * @property {Boolean} vertical
 */

class PlaceBoard extends Board {
  /** @param {import('../../service/gameboard').BoardCoordinates[]} boardCoordinates */
  highlightCells(boardCoordinates) {
    const hightlightClass = 'ship-contour__highlighted';
    const bvMap = boardCoordinates.map((bc) =>
      this.getBoardCellByCoordinates(bc),
    );

    bvMap.forEach((cell) =>
      cell.element.render().classList.add(hightlightClass),
    );

    const toRemoveHightlights = this.cellsMap
      .flat(1)
      .map((cellMap) => cellMap)
      .filter((cell) => bvMap.includes(cell));

    toRemoveHightlights.forEach((cellWithHighlight) => {
      cellWithHighlight.element.render().classList.remove(hightlightClass);
    });
  }
}

/**
 * @implements {UpdatableView<ShipPlacementRequest>}
 */
class PlaceShipsBoardView {
  #root;
  #boardContainer;
  #spanShipBeingSelected;

  #currentListener;
  #mouseEnterListener;
  #verticalPlacementToggle;

  /**
   * @param {ShipPlacementRequest} viewState
   * @param {PlaceBoard} board
   */
  constructor(viewState, board) {
    
    this.#root = document.createElement('div');

    this.#spanShipBeingSelected = document.createElement('span');
    this.#verticalPlacementToggle = document.createElement('input');

    this.#currentListener = null;
    this.#mouseEnterListener = null;

    this.board = board;
    this.#boardContainer = this.board.render();
    this.update(viewState);
  }

  handlePlacement = (handler, command) => {
    handler(command);
  };

  /**
   * @param {import('../../service/gameboard').BoardCoordinates} coordinates
   * @param {Number} size
   * @param {Boolean} vertical
   * @return {import('../../service/gameboard').BoardCoordinates[]}
   */
  #getLineOfCells(coordinates, size, vertical) {
    const { x, y } = coordinates;
    const length = this.board.length;
    const line = [];
    if (!vertical) {
      for (let i = 0; i < size; i++)
        if (x + i < length && y < length) line.push({ x: x + i, y: y });
    } else {
      for (let i = 0; i < size; i++)
        if (x < length && y + i < length) line.push({ x: x, y: y + i });
    }
    return line;
  }

  /** @param {import('../../service/ship').ShipDto} ship */
  #requestShipCoordinates(ship) {
    if (this.#currentListener)
      this.#boardContainer.removeEventListener('click', this.#currentListener);
    
    if (this.#mouseEnterListener)
      this.#boardContainer.removeEventListener(
        'mousemove',
        this.#mouseEnterListener,
      );

    this.#currentListener = (event) => {
      const closest = event.target.closest('.board-cell');
      if (closest) {
        this.handlePlacement({
          ship: ship,
          coordinates: this.board.getCoordinatesByBoardCell(closest),
          vertical: this.#verticalPlacementToggle.checked,
        });
      }
    };
    this.#mouseEnterListener = (/** @type {MouseEvent} */ event) => {
      if (event.target.matches('.board-cell')) {
        const closest = event.target.closest('.board-cell');
        const line = this.#getLineOfCells(
          this.board.getCoordinatesByBoardCell(closest),
          ship.length,
          this.#verticalPlacementToggle.checked,
        );
        this.board.highlightCells(line);
      }
    };

    this.#boardContainer.addEventListener('click', this.#currentListener);
    this.#boardContainer.addEventListener(
      'mouseover',
      this.#mouseEnterListener,
    );

    this.#spanShipBeingSelected.textContent = `Place the ${shipTypeMapping.get(
      ship.type,
    )}`;
  }

  render() {
    this.#boardContainer.classList.add('place-ships-board__centered');

    const verticalContainer = document.createElement('div');

    this.#verticalPlacementToggle.type = 'checkbox';
    this.#verticalPlacementToggle.id = 'vertical';
    this.#verticalPlacementToggle.checked = true;

    const verticalLabel = document.createElement('label');
    verticalLabel.setAttribute('for', 'vertical');
    verticalLabel.textContent = 'Vertical';

    verticalContainer.append(this.#verticalPlacementToggle, verticalLabel);

    this.#root.append(
      this.#spanShipBeingSelected,
      this.#boardContainer,
      verticalContainer,
    );

    return this.#root;
  }

  /** @param {ShipPlacementRequest} shipPlacementRequest */
  update({ ship, boardState }) {
    if (boardState) this.board.update({ cells: boardState });
    if (ship) this.#requestShipCoordinates(ship);
  }
}

export { PlaceShipsBoardView, PlaceBoard };
