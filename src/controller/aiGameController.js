import { AiGameLoop } from "../service/aiGame";

class AiGameController {

  /**
   * 
   * @param {AiGameLoop} model 
   * @param {AIGameView<AIGameState>} view 
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}


export { AiGameController };