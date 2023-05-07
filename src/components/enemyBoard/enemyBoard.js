import { Board } from '../board/board';
import { EnemyBoardCell } from '../enemyBoardCell/enemyBoardCell';

class EnemyBoard extends Board {
  /** @param {import("../board/board").BoardState} boardState */
  constructor(boardState) {
    super(boardState);
    this.cellsMap.forEach((cellArr, i) => {
      cellArr.forEach((cell, j) => {
        this.cellsMap[i][j].element = new EnemyBoardCell({
          ship: null,
          isHit: false,
        });
      });
    });
  }

  handleHit = (handler, hit) => {
    handler(hit);
  };

  render() {
    this.root.replaceChildren();
    this.root.classList.add('board__grid');
    for (let i = 0; i < this.cellsMap.length; i++)
      for (let j = 0; j < this.cellsMap[i].length; j++)
        this.root.appendChild(this.cellsMap[j][i].element.render());

    this.root.addEventListener('click', (event) => {
      const closest = event.target.closest('.board-cell');
      if (closest) this.handleHit(this.getCoordinatesByBoardCell(closest));
    });

    return this.root;
  }
}

export { EnemyBoard };
