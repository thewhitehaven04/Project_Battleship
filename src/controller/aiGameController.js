import { AiGameLoop } from '../service/aiGame';
import { GAME_FINISHED_EVENT } from '../service/game';
import { PubSub } from '../utils/eventBus';
import { AIGameView } from '../view/aiGame/aiGameView';

class AIGameController {
  /**
   * @param {AiGameLoop} model
   * @param {AIGameView} view
   * @param {PubSub} pubSub 
   */
  constructor(model, view, pubSub) {
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
