/**
 * @typedef {Object} AIGameState
 * @property {{boardState: import("../service/gameboard").GameboardDto, player: import("../service/player").PlayerDto}} computer
 * @property {{boardState: import("../service/gameboard").GameboardDto, player: import("../service/player").PlayerDto}} player 
 */

/**
 * @implements {UpdatableView<AIGameState>}
 */
class AIGameView {
  
  constructor(view) {
    this.view = view;
  }

  update() { 

  } 

  render() {

  }
}