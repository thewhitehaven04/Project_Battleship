import { boardCellFactory } from './boardCell';

/**
 * @param {import("../service/gameboard").GameboardDto} initialValue
 * @returns {UpdatableView<import("../service/gameboard").GameboardDto>}
 */
const placeShipsBoardViewFactory = function (initialValue, shipPlacementHandler) {
  const frag = document.createDocumentFragment();

  const states = initialValue.board;

  /** @type {Array<Array<UpdatableView<import("../service/gameboard").BoardCellDto>>>} */
  const cells = Array(initialValue.board.length).fill(undefined);
  const div = document.createElement('div');

  for (let i = 0; i < cells.length; i++) {
    cells[i] = initialValue.board[i].map((initVal) =>
      boardCellFactory(initVal),
    );
  }

  for (let arr of cells) {
    for (let cell of arr) {
      div.appendChild(cell.render());
    }
  }

  return {
    render: function () {
      return frag;
    },
    update: function (gameboardDto) {
      for (let i = 0; i < gameboardDto.board.length; i++) {
        for (let j = 0; j < gameboardDto.board[i].length; j++) {
          if (states[i][j].isHit !== gameboardDto[i][j].isHit) {
            states[i][j] = gameboardDto[i][j];
            cells[i][j].update(gameboardDto[i][j]);
          }
        }
      }
    },
  };
};


export { placeShipsBoardViewFactory };