import { AiGameLoop } from '../service/aiGame';
import { AIGameView } from '../view/aiGame/aiGameView';

class AIGameController {
  /**
   * @param {AiGameLoop} model
   * @param {AIGameView} view
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.handleMove = this.view.handleMove.bind(
      this,
      this.handlePlayerMove,
    );
  }

  /** @param {import("../service/gameboard").BoardCoordinates} moveCoordinates */
  handlePlayerMove = (moveCoordinates) => {
    this.model.nextMove(moveCoordinates);
    this.view.update(this.model.toJSON());
  };
}

export { AIGameController };
