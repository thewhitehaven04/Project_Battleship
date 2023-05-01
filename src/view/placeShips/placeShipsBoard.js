import { ShipType } from '../../service/ship';
import { BoardCellView, boardCellFactory } from '../boardCell/boardCell';
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
  #horizontalPlacementToggle;

  /**
   * @param {ShipPlacementRequest} viewState
   */
  constructor(viewState) {
    this.#state = viewState;

    this.#root = document.createElement('div');
    this.#boardContainer = document.createElement('div');
    this.#spanShipBeingSelected = document.createElement('span');
    this.#horizontalPlacementToggle = document.createElement('input');

    this.#cellsMap = Array(this.#state.boardState?.length).fill([]);
    /** fill the cells and store them in a two-dimensional array so that both their
     * data and dom elements can be found by their indices and vice-versa */
    this.#cellsMap = viewState.boardState.map((cellArray) =>
      cellArray.map((cell) => {
        return {
          data: cell,
          element: new BoardCellView(cell),
        };
      }),
    );
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
    for (let i = 0; i < this.#cellsMap.length; i++) {
      for (let j = 0; j < this.#cellsMap[i].length; j++) {
        if (this.#cellsMap[i][j].element.render() === boardCell)
          return { x: i, y: j };
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
   * @param {Boolean} horizontal
   * @return {BoardViewMapping[]}
   */
  #getLineOfCells(coordinates, size, horizontal) {
    const { x, y } = coordinates;
    const line = [];
    if (horizontal) {
      for (let i = 0; i < size; i++) {
        if (x + i < this.#cellsMap.length && y < this.#cellsMap[x].length)
          line.push(this.#cellsMap[x + i][y]);
      }
    } else {
      for (let i = 0; i < size; i++) {
        if (x < this.#cellsMap.length && y + i < this.#cellsMap[x].length)
          line.push(this.#cellsMap[x][y + i]);
      }
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
          this.#horizontalPlacementToggle.checked,
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
    this.#cellsMap.forEach((cellArr) =>
      cellArr.forEach((cell) => {
        this.#boardContainer.appendChild(cell.element.render());
      }),
    );

    const horizontalContainer = document.createElement('div');

    this.#horizontalPlacementToggle.type = 'checkbox';
    this.#horizontalPlacementToggle.id = 'horizontal';
    this.#horizontalPlacementToggle.checked = true;

    const horizontalLabel = document.createElement('label');
    horizontalLabel.setAttribute('for', 'horizontal');
    horizontalLabel.textContent = 'Horizontal';

    horizontalContainer.append(
      this.#horizontalPlacementToggle,
      horizontalLabel,
    );

    this.#root.append(
      this.#spanShipBeingSelected,
      this.#boardContainer,
      horizontalContainer,
    );

    return this.#root;
  }

  /** @param {ShipPlacementRequest} shipPlacementRequest */
  update({ ship, boardState }) {
    if (boardState)
      this.#cellsMap.forEach((cellArr, i) =>
        cellArr.forEach((cell, j) => {
          if (boardState[i][j] !== cell.data) {
            this.#cellsMap[i][j].data = boardState[i][j];
            this.#cellsMap[i][j].element.update(boardState[i][j]);
          }
        }),
      );

    if (ship) this.#requestShipCoordinates(ship);
  }
}

export { PlaceShipsBoardView };
