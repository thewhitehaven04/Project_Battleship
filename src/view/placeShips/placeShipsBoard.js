import { ShipType } from '../../service/ship';
import { BoardCellView } from '../boardCell/boardCell';
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

/**
 * @typedef BoardViewMapping
 * @property {import('../../service/gameboard').BoardCellDto} data
 * @property {UpdatableView<import('../../service/gameboard').BoardCellDto>} element
 */

/**
 * @implements {UpdatableView<ShipPlacementRequest>}
 */
class PlaceShipsBoardView {
  #state;
  #root;
  #boardContainer;
  #spanShipBeingSelected;

  /** @type {BoardViewMapping[][]} */
  #cellsMap;
  #currentListener;
  #mouseEnterListener;
  #verticalPlacementToggle;

  /**
   * @param {ShipPlacementRequest} viewState
   */
  constructor(viewState) {
    this.#state = viewState;

    this.#root = document.createElement('div');
    this.#boardContainer = document.createElement('div');
    this.#spanShipBeingSelected = document.createElement('span');
    this.#verticalPlacementToggle = document.createElement('input');
    this.#cellsMap = Array(viewState.boardState.length).fill(Array(undefined));

    /** fill the cells and store them in a two-dimensional array so that both their
     * data and dom elements can be found by their indices and vice-versa */
    this.#cellsMap = viewState.boardState.map((cellArr, i) => {
      return cellArr.map((cell, j) => {
        return {
          data: cell,
          element: new BoardCellView(cell),
        };
      });
    });
    this.#currentListener = null;
    this.#mouseEnterListener = null;
    this.update(viewState);
  }

  handlePlacement = (handler, command) => {
    handler(command);
  };

  /**
   * @param {Node} boardCell
   * @return {import('../../service/gameboard').BoardCoordinates}
   */
  #getCoordinatesByCell(boardCell) {
    const length = this.#cellsMap.length;
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        if (this.#cellsMap[i][j].element.render() === boardCell) {
          return { x: i, y: j };
        }
      }
    }
    return { x: -1, y: -1 };
  }

  /** @param {BoardViewMapping[]} boardViewMappings */
  #highlightCells(boardViewMappings) {
    const hightlightClass = 'ship-contour__highlighted';
    boardViewMappings.forEach((cell) => {
      const rendered = cell.element.render();
      if (!rendered.classList.contains(hightlightClass)) {
        rendered.classList.add(hightlightClass);
      }
    });
  }

  /** @param {BoardViewMapping[]} boardViewMappings */
  #removeHighlightCells(boardViewMappings) {
    const hightlightClass = 'ship-contour__highlighted';
    boardViewMappings.forEach((cell) => {
      if (!cell.data?.ship)
        cell.element.render().classList.remove(hightlightClass);
    });
  }

  /**
   * @param {import('../../service/gameboard').BoardCoordinates} coordinates
   * @param {Number} size
   * @param {Boolean} vertical
   * @return {BoardViewMapping[]}
   */
  #getLineOfCells(coordinates, size, vertical) {
    const { x, y } = coordinates;
    const length = this.#cellsMap.length;
    const line = [];
    if (!vertical) {
      for (let i = 0; i < size; i++)
        if (x + i < length && y < length) line.push(this.#cellsMap[x + i][y]);
    } else {
      for (let i = 0; i < size; i++)
        if (x < length && y + i < length) line.push(this.#cellsMap[x][y + i]);
    }
    return line;
  }

  /** @param {import('../../service/ship').ShipDto} ship */
  #requestShipCoordinates(ship) {
    this.#boardContainer.removeEventListener('click', this.#currentListener);
    this.#boardContainer.removeEventListener(
      'mousemove',
      this.#mouseEnterListener,
    );

    this.#currentListener = (event) => {
      const closest = event.target.closest('.board-cell');
      if (closest) {
        this.handlePlacement({
          ship: ship,
          coordinates: this.#getCoordinatesByCell(closest),
          vertical: this.#verticalPlacementToggle.checked,
        });
      }
    };
    this.#mouseEnterListener = (/** @type {MouseEvent} */ event) => {
      const matches = event.target.matches('.board-cell');
      if (matches) {
        const closest = event.target.closest('.board-cell');
        const line = this.#getLineOfCells(
          this.#getCoordinatesByCell(closest),
          ship.length,
          this.#verticalPlacementToggle.checked,
        );
        this.#highlightCells(line);
        let toRemove = this.#cellsMap
          .flat(1)
          .map((cellMap) => cellMap)
          .filter((cell) => !line.includes(cell));
        this.#removeHighlightCells(toRemove);
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
    this.#boardContainer.classList.add(
      'board__grid',
      'place-ships-board__centered',
    );
    for (let i = 0; i < this.#cellsMap.length; i++)
      for (let j = 0; j < this.#cellsMap[i].length; j++)
        this.#boardContainer.appendChild(this.#cellsMap[j][i].element.render());

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
    if (boardState)
      for (let i = 0; i < this.#cellsMap.length; i++) {
        for (let j = 0; j < this.#cellsMap[i].length; j++) {
          if (boardState[i][j] !== this.#cellsMap[i][j].data) {
            this.#cellsMap[i][j].data = boardState[i][j];
            this.#cellsMap[i][j].element.update(boardState[i][j]);
          }
        }
      }

    if (ship) this.#requestShipCoordinates(ship);
  }
}

export { PlaceShipsBoardView };
