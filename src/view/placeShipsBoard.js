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
 * @param {import("../service/gameboard").GameboardDto} initialValue
 * @param {function({ship: ShipType, coordinates: import('../service/gameboard').BoardCoordinates}): void} shipPlacementHandler
 * @returns {UpdatableView<import("../service/gameboard").GameboardDto>}
 */
const placeShipsBoardViewFactory = function (
  initialValue,
  shipPlacementHandler,
) {
  /**
   * @typedef BoardViewMapping
   * @property {import('../service/gameboard').BoardCellDto} data
   * @property {UpdatableView<import('../service/gameboard').BoardCellDto>} element
   */

  const frag = document.createDocumentFragment();
  /* contains reference to the currently active ship request listener function */
  let currentListener;

  /** @type {Array<Array<BoardViewMapping>>} */
  const cells = Array(initialValue.board.length).fill(undefined);
  const div = document.createElement('div');
  const spanShipBeingSelected = document.createElement('span');

  /** fill the cells and store them in a two-dimensional array so that both their
   * data and dom elements can be found by their indices and vice-versa */
  for (let i = 0; i < initialValue.board.length; i++) {
    for (let j = 0; j < initialValue.board[i].length; j++) {
      cells[i][j] = {
        data: initialValue.board[i][j],
        element: boardCellFactory(initialValue.board[i][j]),
      };
      div.appendChild(cells[i][j].element.render());
    }
  }

  /**
   * @param {Node} boardCell
   * @return {import('../service/gameboard').BoardCoordinates}
   */
  const _getCoordinatesByCell = (boardCell) => {
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        return cells[i][j].element.render() === boardCell
          ? { x: i, y: j }
          : { x: -1, y: -1 };
      }
    }
  };

  const render = function () {
    return frag;
  };
  /**
   * @param {import('../service/gameboard').GameboardDto} gameboardDto
   */
  const update = function (gameboardDto) {
    for (let i = 0; i < gameboardDto.board.length; i++) {
      for (let j = 0; j < gameboardDto.board[i].length; j++) {
        let data = gameboardDto[i][j];
      }
    }
  };
  /**
   * @param {import('../service/ship').ShipDto} shipTypeRequest
   */
  const requestShipCoordinates = function (shipTypeRequest) {
    spanShipBeingSelected.textContent = `Place the ${shipTypeMapping.get(
      shipTypeRequest.type,
    )}`;
    div.removeEventListener('click', currentListener);

    currentListener = (event) => {
      if (event.target.matches('.board-cell')) {
        const coordinates = _getCoordinatesByCell(event.target);
        shipPlacementHandler({
          ship: shipTypeRequest.type,
          coordinates: coordinates,
        });
      }
    };

    div.addEventListener('click', currentListener);
  };

  return {
    render,
    update,
    requestShipCoordinates,
  };
};

export { placeShipsBoardViewFactory };
